import jwt from "jsonwebtoken";
import argon2 from "argon2";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../traits/errors";
import { Account, Configuration, IAccount } from "../models";
import {
  generateToken,
  getAccessCode,
  sendForgetPasswordEmail,
  sendVerifyEmail,
} from "../utils";
import trimAllBody from "../utils/trim-all-body";
import { ROLES } from "../traits/role";
import emailPattern from "../traits/email-pattern";
import { NextFunction, Request, Response } from "express";
import getRoleName from "../utils/get-role-name";
import filterProperties from "../utils/filterProperties";

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
      throw new BadRequestError(
        "Please enter a working email address. Email is a necessary field.",
      );
    }
    if (!emailPattern.test(email)) {
      throw new BadRequestError("Please enter a correct email address.");
    }
    if (!password) {
      throw new BadRequestError(
        "To ensure the security of your account, kindly provide a password.",
      );
    }
    if (password.length < 8) {
      throw new BadRequestError(
        "Please pick a password that is at least 8 characters long for the security of your account.",
      );
    }
    if (!accessCodeInput) {
      throw new BadRequestError(
        "Please enter the needed access code to continue.",
      );
    }
    const accessCode = await getAccessCode(Configuration);

    if (accessCodeInput !== accessCode) {
      throw new UnauthorizedError(
        "Denied access. The access code you entered is inapplicable. Please check the code and try once more.",
      );
    }

    if (request.file) request.body.photo = request.file.filename;

    const hash: string = generateToken();

    trimAllBody(request);

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

    const account = await Account.create(request.body) as IAccount;

    const { id } = account;
    const token = jwt.sign({ id, email, name }, String(process.env.JWT_SECRET));
    await sendVerifyEmail(hash, account);

    const filteredAccount: Record<string, any> = filterProperties(account, [
      "name",
      "email",
      "role",
    ], { role: getRoleName(Number(account.role)) });

    return response.status(StatusCodes.CREATED).json({
      message: "Please check your email for any additional instructions",
      account: filteredAccount,
      token,
    });
  } catch (error: any) {
    if (error.message?.indexOf("duplicate key error") !== -1) {
      error.code = StatusCodes.CONFLICT;
      error.message =
        "We apologize, but it appears that the email address you provided is already registered. To complete the registration process, kindly enter a different email address.";
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
      throw new BadRequestError(
        "Please enter a working email address. Email is a necessary field.",
      );
    }
    if (!emailPattern.test(email)) {
      throw new BadRequestError("Please enter a correct email address.");
    }
    if (!password) {
      throw new BadRequestError(
        "Please type in your password.",
      );
    }

    const account = await Account.findOne({
      email,
      deletedAt: null,
    });

    if (!account) {
      throw new NotFoundError(
        "We apologize, but the requested account was not found.",
      );
    }
    if (!account.verify) {
      throw new UnauthorizedError(
        "Please be aware that your account has not yet been verified, which we regret. A critical step in ensuring the safety and reliability of our platform is account verification. Please check your registered email for a verification link or further instructions before continuing. Please double-check your spam or junk folder if you haven't received a verification email. ",
      );
    }

    const valid = await argon2.verify(account.password, password);

    if (!valid) {
      throw new UnauthorizedError(
        "Sorry, but the password you provided is unreliable. Please try again after double-checking your password.",
      );
    }
    const { id, name } = account;

    const token = jwt.sign({ id, email, name }, String(process.env.JWT_SECRET));

    const filteredAccount: Record<string, any> = filterProperties(account, [
      "name",
      "email",
      "role",
    ], { role: getRoleName(Number(account.role)) });

    return response.status(StatusCodes.OK).json({
      message:
        "Welcome! Your account has been successfully logged into. Enjoy yourself and feel free to explore the features and services that are offered. ",
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
          throw new BadRequestError(
            "Verification of token failed. Check the details provided, then try once more.",
          );
        }
        email = (decoded as { id: string; name: string; email: string }).email;
      },
    );

    const account = await Account.findOne({ email });
    if (!account) {
      throw new NotFoundError(
        "We apologize, but the requested account was not found.",
      );
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
      throw new BadRequestError(
        "The supplied token is not valid. Make sure token field is entered correctly.",
      );
    }
    const account = await Account.findOne({ hash });
    if (!account) {
      throw new NotFoundError(
        "We apologize, but the requested account was not found.",
      );
    }
    account.hash = null;
    account.verify = true;
    await account.save();
    return response.status(StatusCodes.OK).json({
      message:
        "Congratulations! Your account has been verified successfully. Now that you have accessed your account, you can use our services as you please.",
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
      throw new BadRequestError(
        "Please enter a working email address. Email is a necessary field.",
      );
    }
    const account = await Account.findOne({ email, deletedAt: null });
    if (!account) {
      throw new NotFoundError(
        "We apologize, but the requested account was not found.",
      );
    }
    const token: string = generateToken(3);
    const forgetToken = token;
    account.forgetToken = token;
    await account.save();
    await sendForgetPasswordEmail(forgetToken, account);
    return response.status(StatusCodes.OK).json({
      message: "Please check your email for any additional instructions",
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
      throw new BadRequestError(
        "The supplied token is not valid. Make sure token field is entered correctly.",
      );
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
      throw new NotFoundError(
        "We apologize, but the requested account was not found.",
      );
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
