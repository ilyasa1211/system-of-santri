"use strict";

const jwt = require("jsonwebtoken");
const argon2 = require("argon2");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError, UnauthorizedError, BadRequestError } = require(
  "../errors",
);
const { Account } = require("../models");
const { sendVerifyEmail, sendForgetPasswordEmail, generateToken } = require(
  "../utils",
);
const trimAllBody = require("../utils/trim-all-body");
const { SANTRI } = require("../traits/role");

module.exports = { signup, signin, verify, forgotPassword, resetPassword };

/**
 * Register an account
 * @param {Request} request
 * @param {Response} response
 * @param {VoidFunction} next
 */
async function signup(request, response, next) {
  try {
    const uncreatedAccount = request.body;
    const date = new Date();
    const { name, email, password } = request.body;
    if (request.file) request.body.photo = request.file.filename;
    const hash = generateToken();
    trimAllBody(req);
    uncreatedAccount.verify = false;
    uncreatedAccount.verifyExpiration = date.setDate(date.getDate() + 1);
    uncreatedAccount.role_id = SANTRI;
    uncreatedAccount.hash = hash;
    uncreatedAccount.password = await argon2.hash(password, {
      type: argon2.argon2i,
    });
    const account = await Account.create(uncreatedAccount);
    const { id } = account;
    const token = jwt.sign({ id, email, name }, process.env.JWT_SECRET);
    await sendVerifyEmail(hash, email);
    return response.status(StatusCodes.OK).json({
      message: "Please check your email for any additional instructions",
      token,
    });
  } catch (error) {
    if (error.message.indexOf("duplicate key error") !== -1) {
      error.message =
        "We apologize, but it appears that the email address you provided is already registered. To complete the registration process, kindly enter a different email address.";
    }
    next(error);
  }
}

/**
 * Login to an account
 * @param {Request} request
 * @param {Response} response
 * @param {VoidFunction} next
 */
async function signin(request, response, next) {
  try {
    const { email, password } = request.body;
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
    const token = jwt.sign({ id: account.id }, process.env.JWT_SECRET);
    return response.status(StatusCodes.OK).json({
      message:
        "Welcome! Your account has been successfully logged into. Enjoy yourself and feel free to explore the features and services that are offered. ",
      token,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * coming soon
 *  Used to resend email verification token
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
// async function resendVerifyEmail (request, response, next) {
//     try {
//         const { user: account } = req
//         const { email } = account
//         if (!email) throw new NotFoundError('Account not found')
//         const hash = generateToken()
//         account.hash = hash
//         await account.save()
//         await sendVerifyEmail(hash, email)
//         response.status(StatusCodes.OK).json({ message: 'Success resend verification email' })
//     } catch (error) {
//         next(error)
//     }
// }

/**
 * Verify an account
 * @param {Request} request
 * @param {Response} response
 * @param {VoidFunction} next
 */
async function verify(request, response, next) {
  try {
    const hash = request.query.hash;
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
  } catch (error) {
    next(error);
  }
}

/**
 * When a user forgot their account password
 * @param {Request} request
 * @param {Response} response
 * @param {VoidFunction} next
 */
async function forgotPassword(request, response, next) {
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
    const token = generateToken();
    const forgetToken = jwt.sign({ token }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    account.forgetToken = token;
    await account.save();
    await sendForgetPasswordEmail(forgetToken, email);
    return response.status(StatusCodes.OK).json({
      message: "Please check your email for any additional instructions",
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Reset account password
 * @param {Request} request
 * @param {Response} response
 * @param {VoidFunction} next
 */
async function resetPassword(request, response, next) {
  try {
    const { forgetToken } = request.body;
    const { password, confirmPassword } = request.body;

    if (!token) {
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
    response.status(StatusCodes.OK).json({
      message: "Your new password was changed successfully.",
    });
  } catch (error) {
    next(error);
  }
}
