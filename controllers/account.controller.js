"use strict";

const jwt = require("jsonwebtoken");
const fs = require("node:fs");
const path = require("node:path");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError } = require("../errors");
const argon2 = require("argon2");
const { Account, Resume, Work } = require("../models");
const { authorize } = require("../utils");
const trimAllBody = require("../utils/trim-all-body");

const projection = {
  password: 0,
  verify: 0,
  hash: 0,
  forgetToken: 0,
  __v: 0,
};

module.exports = {
  index,
  profile,
  show,
  update,
  destroy,
  trash,
  restore,
  eliminate,
  insert,
  workIndex,
  workShow,
  resume,
};

/**
 *  Get All Accounts, everyone has rights
 * @param {Request} request
 * @param {Response} response
 * @param {Function} next
 */
async function index(request, response, next) {
  try {
    const withTrashed = request.query.trashed;
    const option = { deletedAt: null };
    if (withTrashed) option.deletedAt = { $ne: null };
    const accounts = await Account.find(option, projection);
    return response.status(StatusCodes.OK).json({ accounts });
  } catch (error) {
    next(error);
  }
}
/**
 * Create an account to the database, only admin has rights
 * @param {Request} request
 * @param {Response} response
 * @param {VoidFunction} next
 */
async function insert(request, response, next) {
  try {
    if (request.file) request.body.avatar = request.file.filename;
    trimAllBody(req);
    request.body.verify = true;
    request.body.password = await argon2.hash(request.body.password, {
      type: argon2.argon2i,
    });
    const account = await Account.create(request.body);
    const { id } = account;
    const token = jwt.sign(
      { id, name: request.body.name },
      process.env.JWT_SECRET,
    );
    return response.status(StatusCodes.OK).json({ token });
  } catch (error) {
    next(error);
  }
}

/**
 * Show one account, everyone has rights
 * @param {Request} request
 * @param {Response} response
 * @param {VoidFunction} next
 */
async function show(request, response, next) {
  try {
    const { id } = request.params;
    const account = await Account.findOne(
      { _id: id, deletedAt: null },
      projection,
    );
    return response.status(StatusCodes.OK).json({ account });
  } catch (error) {
    next(error);
  }
}

/**
 * Update the existing account, the user of the account and admin has rights
 * @param {Request} request
 * @param {Response} response
 * @param {VoidFunction} next
 */
async function update(request, response, next) {
  try {
    const { id } = request.params;
    authorize(request.user, id);
    request.body.updatedAt = Date.now();
    await Account.findOneAndUpdate(
      { _id: id, deletedAt: null },
      request.body,
    );
    return response.status(StatusCodes.OK).json({
      message:
        "Congratulations on finishing up your account update! Your suggestions have been carried out.",
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Delete one account not permanently, the user of the account and admin has rights
 * @param {Request} request
 * @param {Response} response
 * @param {VoidFunction} next
 */
async function destroy(request, response, next) {
  try {
    const { id } = request.params;
    authorize(request.user, id);
    await Account.findOneAndUpdate(
      { _id: id, deletedAt: null },
      { deletedAt: Date.now() },
    );
    return response.status(StatusCodes.OK).json({
      message:
        "That your account has been deleted, we apologize. Please let us know if you need any help or if you have any questions.",
    });
  } catch (error) {
    next(error);
  }
}
/**
 * Show all deleted account, admin has rights
 * @param {Request} request
 * @param {Response} response
 * @param {VoidFunction} next
 */
async function trash(request, response, next) {
  try {
    const accounts = await Account.find({ deletedAt: { $ne: null } });
    return response.status(StatusCodes.OK).json({ accounts });
  } catch (error) {
    next(error);
  }
}

/**
 * Restore one of the deleted account, admin has rights
 * @param {Request} request
 * @param {Response} response
 * @param {VoidFunction} next
 */
async function restore(request, response, next) {
  try {
    const { id } = request.params;
    await Account.findByIdAndUpdate(id, { deletedAt: null });
    return response.status(StatusCodes.OK).json({
      message:
        "Good news! Your account has been restored successfully. Hello again! Please feel free to ask any questions or for additional help.",
    });
  } catch (error) {
    next(error);
  }
}
/**
 * Delete one account PERMANENTLY be careful, admin has rights
 * @param {Request} request
 * @param {Response} response
 * @param {VoidFunction} next
 */
async function eliminate(request, response, next) {
  try {
    const { id } = request.params;
    const account = await Account.findById(id);
    const { photo } = account;
    await account.deleteOne();
    if (photo !== "default-avatar.jpg") {
      fs.unlink(
        path.join(__dirname, "..", "public", "images", "account", photo),
        (error) => {
          if (error) throw error;
        },
      );
    }
    return response.status(StatusCodes.OK).json({
      message:
        "All associated data was successfully deleted and the account was successfully cleared.",
    });
  } catch (error) {
    next(error);
  }
}
/**
 * Get information about my account, everyone has rights
 * @param {Request} request
 * @param {Response} response
 * @param {VoidFunction} next
 */
async function profile(request, response, next) {
  try {
    const { id } = request.user;
    const account = await Account.findById(id, projection);
    return response.status(StatusCodes.OK).json({ account });
  } catch (error) {
    next(error);
  }
}

/**
 * Get all works about an account, everyone has rights
 * @param {Request} request
 * @param {Response} response
 * @param {VoidFunction} next
 */
async function workIndex(request, response, next) {
  try {
    const { id } = request.params;
    const works = await Work.find({ account_id: id, deletedAt: null });
    return response.json({ works });
  } catch (error) {
    next(error);
  }
}

/**
 * Get a work about an account, everyone has rights
 * @param {Request} request
 * @param {Response} response
 * @param {VoidFunction} next
 */
async function workShow(request, response, next) {
  try {
    const { workId, id } = request.params;
    const works = await Work.find({
      _id: workId,
      account_id: id,
      deletedAt: null,
    });
    if (!works) {
      throw new NotFoundError(
        "We're sorry to let you know that we were unable to locate the requested work. Please double-check your entry of accurate information before attempting again. Please don't hesitate to contact our support staff if you need more help.",
      );
    }
    return response.status(StatusCodes.OK).json({ works });
  } catch (error) {
    next(error);
  }
}

/**
 * Get a resume of an account, everyone has rights
 * @param {Request} request
 * @param {Response} response
 * @param {VoidFunction} next
 */
async function resume(request, response, next) {
  try {
    const { id } = request.params;
    const resume = await Resume.findOne({ account_id: id });
    if (!resume) {
      throw new NotFoundError(
        "We regret the inconvenience, but we were unable to locate the requested resume. Please verify the information provided.",
      );
    }
    return response.status(StatusCodes.OK).json({ resume });
  } catch (error) {
    next(error);
  }
}
