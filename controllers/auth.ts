import jwt from "jsonwebtoken";
import argon2 from "argon2";
import { StatusCodes } from "http-status-codes";
import {
	BadRequestError,
	NotFoundError,
	UnauthorizedError,
} from "../traits/errors";
import { Account, Configuration, IAccount } from "../models";
import {
	generateToken,
	getAccessCode,
	sendForgetPasswordEmail,
	sendVerifyEmail,
} from "../utils";
import { ROLES } from "../traits/role";
import emailPattern from "../traits/email-pattern";
import { NextFunction, Request, Response } from "express";
import getRoleName from "../utils/get-role-name";
import filterProperties from "../utils/filter-properties";
import { ResponseMessage } from "../traits/response";

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
		if (!email) {
			throw new BadRequestError(ResponseMessage.EMPTY_EMAIL);
		}
		if (!emailPattern.test(email)) {
			throw new BadRequestError(ResponseMessage.INVALID_EMAIL);
		}
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

		const hash: string = generateToken();

		const defaultValue = {
			verify: false,
			verifyExpiration: date.setDate(date.getDate() + 1),
			role_id: ROLES.SANTRI,
			hash: hash,
			password: await argon2.hash(password, {
				type: argon2.argon2i,
			}),
		};

		Object.assign(request.body, defaultValue);

		const account = (await Account.create(request.body)) as IAccount;

		const { id } = account;
		const token = jwt.sign({ id, email, name }, String(process.env.JWT_SECRET));
		await sendVerifyEmail(hash, account);

		const filteredAccount: Record<string, any> = filterProperties(
			account,
			["name", "role"],
			{ role: getRoleName(Number(account.role)) },
		);

		return response.status(StatusCodes.CREATED).json({
			message: ResponseMessage.CHECK_EMAIL,
			account: filteredAccount,
			token,
		});
	} catch (error: any) {
		if (error.message?.indexOf("duplicate key error") !== -1) {
			error.code = StatusCodes.CONFLICT;
			error.message = ResponseMessage.SIGNUP_CONFLICT;
		}
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

		if (!email) {
			throw new BadRequestError(ResponseMessage.EMPTY_EMAIL);
		}
		if (!emailPattern.test(email)) {
			throw new BadRequestError(ResponseMessage.INVALID_EMAIL);
		}
		if (!password) {
			throw new BadRequestError(ResponseMessage.EMPTY_PASSWORD);
		}

		const account = await Account.findOne({
			email,
			deletedAt: null,
		});

		if (!account) {
			throw new NotFoundError(ResponseMessage.ACCOUNT_NOT_FOUND);
		}
		if (!account.verify) {
			throw new UnauthorizedError(ResponseMessage.UNVERIFIED_ACCOUNT);
		}

		const valid = await argon2.verify(account.password, password);

		if (!valid) {
			throw new UnauthorizedError(ResponseMessage.WRONG_PASSWORD);
		}
		const { id, name } = account;

		const token = jwt.sign({ id, email, name }, String(process.env.JWT_SECRET));

		const filteredAccount: Record<string, any> = filterProperties(
			account,
			["name", "role"],
			{ role: getRoleName(Number(account.role)) },
		);

		return response.status(StatusCodes.OK).json({
			message: ResponseMessage.LOGIN_SUCCEED,
			account: filteredAccount,
			token,
		});
	} catch (error: any) {
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
		let authToken: string | undefined = undefined;
		let email: string | undefined = undefined;
		if (
			request.headers.authorization &&
			request.headers.authorization.split(" ")[0] === "Bearer"
		) {
			authToken = request.headers.authorization.split(" ")[1];
		}
		if (!authToken) {
			throw new BadRequestError("Please provide authorization header.");
		}

		jwt.verify(
			authToken,
			String(process.env.JWT_SECRET),
			function (error, decoded) {
				if (error) {
					throw new BadRequestError(ResponseMessage.TOKEN_FAILED);
				}
				email = (decoded as { id: string; name: string; email: string }).email;
			},
		);

		const account = await Account.findOne({ email });
		if (!account) {
			throw new NotFoundError(ResponseMessage.ACCOUNT_NOT_FOUND);
		}
		const hash: string = generateToken();

		account.hash = hash;
		await account.save();
		await sendVerifyEmail(hash, account);
		return response.status(StatusCodes.OK).json({
			message:
				"Your confirmation email was successfully sent again. Check your inbox, then adhere to the directions to finish the verification process. Don't forget to look in your spam or junk folder if you don't see the email in your inbox.",
		});
	} catch (error: any) {
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
		const account = await Account.findOne({ hash });
		if (!account) {
			throw new NotFoundError(ResponseMessage.ACCOUNT_NOT_FOUND);
		}
		account.hash = null;
		account.verify = true;
		await account.save();
		return response.status(StatusCodes.OK).json({
			message: ResponseMessage.ACCOUNT_VERIFIED,
		});
	} catch (error: any) {
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
		const token: string = generateToken(3);
		const forgetToken = token;
		account.forgetToken = token;
		await account.save();
		await sendForgetPasswordEmail(forgetToken, account);
		return response.status(StatusCodes.OK).json({
			message: ResponseMessage.CHECK_EMAIL,
		});
	} catch (error: any) {
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
		account.password = await argon2.hash(password, { type: argon2.argon2i });
		account.forgetToken = null;
		await account.save();
		return response.status(StatusCodes.OK).json({
			message: "Your new password was changed successfully.",
		});
	} catch (error: any) {
		next(error);
	}
}
