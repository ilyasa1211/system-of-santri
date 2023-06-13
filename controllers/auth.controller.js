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
    response.json({ message: "Please check your email to verify", token });
  } catch (error) {
    if (error.message.indexOf("duplicate key error") !== -1) {
      error.message = "Please use another email";
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
      verify: true,
    });
    if (!account) throw new NotFoundError("Account not found");
    const valid = await argon2.verify(account.password, password);
    if (!valid) throw new UnauthorizedError("Invalid password");
    const token = jwt.sign({ id: account.id }, process.env.JWT_SECRET);
    response.status(StatusCodes.OK).json({ message: "Success signin", token });
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
    if (!hash) throw new BadRequestError("Token missing");
    const account = await Account.findOne({ hash });
    if (!account) throw new NotFoundError("Account not found");
    account.hash = null;
    account.verify = true;
    await account.save();
    response.status(StatusCodes.OK).json({ message: "Account Verified" });
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
    if (!email) throw new BadRequestError("Email is required");
    const account = await Account.findOne({ email, deletedAt: null });
    if (!account) throw new NotFoundError("Account not found");
    const token = generateToken();
    const forgetToken = jwt.sign({ token }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    account.forgetToken = token;
    await account.save();
    await sendForgetPasswordEmail(forgetToken, email);
    response.json({ message: "Please check your email" });
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
    const { token } = request.query;
    const { password, confirmPassword } = request.body;

    if (!token) throw new BadRequestError("Token Invalid");
    if (!password) {
      throw new BadRequestError(
        "Please set your new password, don't forget it :)",
      );
    }
    if (password !== confirmPassword) {
      throw new BadRequestError(
        "Password and Confirmation Password does not match",
      );
    }
    let decoded;
    jwt.verify(token, process.env.JWT_SECRET, (error, jwtPayload) => {
      if (error) throw new BadRequestError("Invalid Token");
      if (jwtPayload.exp < Date.now() / 1000) {
        throw new UnauthorizedError("Token Expired");
      }
      decoded = jwtPayload;
    });
    const account = await Account.findOne({ forgetToken: decoded.token });
    if (!account) throw new NotFoundError("Account not found");
    account.password = await argon2.hash(password, { type: argon2.argon2i });
    account.forgetToken = null;
    await account.save();
    response.status(StatusCodes.OK).json({
      message: "Password Change Successfully",
    });
  } catch (error) {
    next(error);
  }
}
