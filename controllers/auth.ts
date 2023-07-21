import argon2 from "argon2";
import { StatusCodes } from "http-status-codes";
import {
	BadRequestError,
	NotFoundError,
	UnauthorizedError,
} from "../traits/errors";
import { Account, Configuration, IAccount } from "../models";
import { getAccessCode, getRoleName } from "../utils";
import { ROLES } from "../traits/role";
import { NextFunction, Request, Response } from "express";
import { ResponseMessage } from "../traits/response";
import Email, { ForgetEmail, VerifyEmail } from "../helpers/email";
import Token from "../helpers/token";
import Password from "../helpers/password";

export {
	forgotPassword,
	resendVerifyEmail,
	resetPassword,
	signin,
	signup,
	verify,
};

/**
 * Register an account
 */
async function signup(
	request: Request,
	response: Response,
	next: NextFunction,
) {
	try {
		const date = new Date();
		const { name, email, password, accessCode: accessCodeInput } = request.body;

		Email.validate(email);

		if (!password) {
			throw new BadRequestError(ResponseMessage.EMPTY_PASSWORD);
		}
		if (password.length < 8) {
			throw new BadRequestError(ResponseMessage.WEAK_PASSWORD);
		}
		if (!accessCodeInput) {
			throw new BadRequestError(ResponseMessage.EMPTY_ACCESS_CODE);
		}
		const accessCode: string = await getAccessCode(Configuration);

		if (accessCodeInput !== accessCode) {
			throw new UnauthorizedError(ResponseMessage.WRONG_ACCESS_CODE);
		}

		if (request.file) request.body.photo = request.file.filename;

		const hash: string = Token.generateRandomToken();

		const defaultValue = {
			verify: false,
			verifyExpiration: date.setDate(date.getDate() + 1),
			roleId: ROLES.SANTRI,
			hash,
			password: await argon2.hash(password, {
				type: argon2.argon2i,
			}),
		};

		Object.assign(request.body, defaultValue);

		const account = (await Account.create(request.body)) as IAccount;

		const { id, roleId } = account;

		const filteredAccount = {
			id,
			name,
			role: {
				id: roleId,
				name: getRoleName(roleId),
			},
		};

		const token = Token.generateJwtToken(account);

		new Email(account).send(new VerifyEmail(hash));

		return response.status(StatusCodes.CREATED).json({
			message: ResponseMessage.CHECK_EMAIL,
			account: filteredAccount,
			token,
		});
	} catch (error: unknown) {
		next(error);
	}
}

/**
 * Login to an account
 */
async function signin(
	request: Request,
	response: Response,
	next: NextFunction,
) {
	try {
		const { email, password } = request.body;

		Email.validate(email);

		if (!password) {
			throw new BadRequestError(ResponseMessage.EMPTY_PASSWORD);
		}

		const account = (await Account.findOne({
			email,
			deletedAt: null,
		})
			.select("name roleId password email verify")
			.exec()) as IAccount;

		const { id, name, roleId } = account;

		const filteredAccount = {
			id,
			name,
			role: {
				id: roleId,
				name: getRoleName(roleId),
			},
		};

		if (!account) {
			throw new NotFoundError(ResponseMessage.ACCOUNT_NOT_FOUND);
		}
		if (!account.verify) {
			throw new UnauthorizedError(ResponseMessage.UNVERIFIED_ACCOUNT);
		}

		const valid = await Password.verify(account.password, password);

		if (!valid) {
			throw new UnauthorizedError(ResponseMessage.WRONG_PASSWORD);
		}

		const token = Token.generateJwtToken(account);

		return response.status(StatusCodes.OK).json({
			message: ResponseMessage.LOGIN_SUCCEED,
			account: filteredAccount,
			token,
		});
	} catch (error: unknown) {
		next(error);
	}
}

/**
 *  Used to resend email verification token
 */
async function resendVerifyEmail(
	request: Request,
	response: Response,
	next: NextFunction,
) {
	try {
		const jwtToken: string = Token.getJwtToken(request);
		const { email } = Token.getJwtPayload(jwtToken)!;

		const account = await Account.findOne({ email }).select("email").exec();
		if (!account) {
			throw new NotFoundError(ResponseMessage.ACCOUNT_NOT_FOUND);
		}
		const hash: string = Token.generateRandomToken();

		account.hash = hash;
		await account.save();

		new Email(account).send(new VerifyEmail(hash));

		return response.status(StatusCodes.OK).json({
			message:
				"Your confirmation email was successfully sent again. Check your inbox, then adhere to the directions to finish the verification process. Don't forget to look in your spam or junk folder if you don't see the email in your inbox.",
		});
	} catch (error: unknown) {
		next(error);
	}
}

/**
 * Verify an account
 */
async function verify(
	request: Request,
	response: Response,
	next: NextFunction,
) {
	try {
		const { hash } = request.query;
		if (!hash) {
			throw new BadRequestError(ResponseMessage.EMPTY_TOKEN);
		}
		const account = await Account.findOne({ hash }).exec();
		if (!account) {
			throw new NotFoundError(ResponseMessage.ACCOUNT_NOT_FOUND);
		}
		account.hash = null;
		account.verify = true;
		await account.save();
		return response.status(StatusCodes.OK).json({
			message: ResponseMessage.ACCOUNT_VERIFIED,
		});
	} catch (error: unknown) {
		next(error);
	}
}

/**
 * When a user forgot their account password
 */
async function forgotPassword(
	request: Request,
	response: Response,
	next: NextFunction,
) {
	try {
		const { email } = request.body;
		if (!email) {
			throw new BadRequestError(ResponseMessage.EMPTY_EMAIL);
		}
		const account = await Account.findOne({ email, deletedAt: null });
		if (!account) {
			throw new NotFoundError(ResponseMessage.ACCOUNT_NOT_FOUND);
		}
		const token: string = Token.generateRandomToken(3);
		const forgetToken = token;
		account.forgetToken = token;
		await account.save();

		new Email(account).send(new ForgetEmail(forgetToken));

		return response.status(StatusCodes.OK).json({
			message: ResponseMessage.CHECK_EMAIL,
		});
	} catch (error: unknown) {
		next(error);
	}
}

/**
 * Reset account password
 */
async function resetPassword(
	request: Request,
	response: Response,
	next: NextFunction,
) {
	try {
		const { token: forgetToken } = request.query;
		const { password, confirmPassword } = request.body;
		if (!forgetToken) {
			throw new BadRequestError(ResponseMessage.EMPTY_TOKEN);
		}
		if (!password) {
			throw new BadRequestError(
				"Please enter your new password in order to continue.",
			);
		}
		if (password !== confirmPassword) {
			throw new BadRequestError(
				"Your provided confirmation password and password for your password do not match. For successful verification, please make sure the password in both fields matches.",
			);
		}
		const account = await Account.findOne({ forgetToken });
		if (!account) {
			throw new NotFoundError(ResponseMessage.ACCOUNT_NOT_FOUND);
		}
		account.password = await Password.hash(password);
		account.forgetToken = null;
		await account.save();
		return response.status(StatusCodes.OK).json({
			message: "Your new password was changed successfully.",
		});
	} catch (error: unknown) {
		next(error);
	}
}
