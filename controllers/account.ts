import jwt from "jsonwebtoken";
import fs from "node:fs";
import path from "node:path";
import { StatusCodes } from "http-status-codes";
import { NotFoundError } from "../traits/errors";
import argon2 from "argon2";
import { Account, IAccount, Resume, Work } from "../models";
import { authorize } from "../utils";
import trimAllBody from "../utils/trim-all-body";
import { NextFunction, Request, Response } from "express";

const projection = {
  password: 0,
  verify: 0,
  hash: 0,
  forgetToken: 0,
  __v: 0,
};

export {
  destroy,
  eliminate,
  index,
  insert,
  profile,
  restore,
  resume,
  show,
  trash,
  update,
  workIndex,
  workShow,
};

/**
 *  Get All Accounts, everyone has rights
 */
async function index(request: Request, response: Response, next: NextFunction) {
  try {
    const withTrashed = request.query.trashed;
    const option: { deletedAt: null | Record<string, any> } = {
      deletedAt: null,
    };
    if (withTrashed) option.deletedAt = { $ne: null };
    const accounts = await Account.find(option, projection);
    return response.status(StatusCodes.OK).json({ accounts });
  } catch (error: any) {
    next(error);
  }
}
/**
 * Create an account to the database, only admin has rights
 */
async function insert(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    if (request.file) request.body.avatar = request.file.filename;
    trimAllBody(request);
    request.body.verify = true;
    request.body.password = await argon2.hash(request.body.password, {
      type: argon2.argon2i,
    });
    const account = await Account.create(request.body);
    const { id } = account;
    const token = jwt.sign(
      { id, name: request.body.name },
      String(process.env.JWT_SECRET),
    );
    return response.status(StatusCodes.OK).json({ token });
  } catch (error: any) {
    next(error);
  }
}

/**
 * Show one account, everyone has rights
 */
async function show(request: Request, response: Response, next: NextFunction) {
  try {
    const { id } = request.params;
    const account = await Account.findOne(
      { _id: id, deletedAt: null },
      projection,
    );
    return response.status(StatusCodes.OK).json({ account });
  } catch (error: any) {
    next(error);
  }
}

/**
 * Update the existing account, the user of the account and admin has rights
 */
async function update(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const { id }: { id?: string } = request.params;
    authorize(request.user as IAccount, id);
    request.body.updatedAt = Date.now();
    await Account.findOneAndUpdate(
      { _id: id, deletedAt: null },
      request.body,
    );
    return response.status(StatusCodes.OK).json({
      message:
        "Congratulations on finishing up your account update! Your suggestions have been carried out.",
    });
  } catch (error: any) {
    next(error);
  }
}

/**
 * Delete one account not permanently, the user of the account and admin has rights
 */
async function destroy(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const { id }: { id?: string } = request.params;
    authorize(request.user as IAccount, id);
    await Account.findOneAndUpdate(
      { _id: id, deletedAt: null },
      { deletedAt: Date.now() },
    );
    return response.status(StatusCodes.ACCEPTED).json({
      message:
        "That your account has been deleted, we apologize. Please let us know if you need any help or if you have any questions.",
    });
  } catch (error: any) {
    next(error);
  }
}
/**
 * Show all deleted account, admin has rights
 */
async function trash(request: Request, response: Response, next: NextFunction) {
  try {
    const accounts = await Account.find({ deletedAt: { $ne: null } });
    return response.status(StatusCodes.OK).json({ accounts });
  } catch (error: any) {
    next(error);
  }
}

/**
 * Restore one of the deleted account, admin has rights
 */
async function restore(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const { id }: { id?: string } = request.params;
    await Account.findByIdAndUpdate(id, { deletedAt: null });
    return response.status(StatusCodes.OK).json({
      message:
        "Good news! Your account has been restored successfully. Hello again! Please feel free to ask any questions or for additional help.",
    });
  } catch (error: any) {
    next(error);
  }
}
/**
 * Delete one account PERMANENTLY be careful, admin has rights
 */
async function eliminate(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const { id }: { id?: string } = request.params;
    const account = await Account.findById(id);
    if (!account) {
      throw new NotFoundError(
        "We apologize, but the requested account was not found.",
      );
    }
    const { avatar } = account as IAccount;

    await account.deleteOne();

    if (avatar !== "default-avatar.jpg") {
      fs.unlink(
        path.join(__dirname, "..", "public", "images", "account", avatar),
        (error) => {
          if (error) throw error;
        },
      );
    }
    return response.status(StatusCodes.OK).json({
      message:
        "All associated data was successfully deleted and the account was successfully cleared.",
    });
  } catch (error: any) {
    next(error);
  }
}
/**
 * Get information about my account, everyone has rights
 */
async function profile(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const { id } = request.user as IAccount;
    const account = await Account.findById(id, projection);
    if (!account) {
      throw new NotFoundError(
        "We apologize, but the requested account was not found.",
      );
    }
    return response.status(StatusCodes.OK).json({ account });
  } catch (error: any) {
    next(error);
  }
}

/**
 * Get all works about an account, everyone has rights
 */
async function workIndex(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const { id } = request.params;
    const works = await Work.find({ account_id: id });

    return response.json({ works });
  } catch (error: any) {
    next(error);
  }
}

/**
 * Get a work about an account, everyone has rights
 */
async function workShow(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const { workId, id } = request.params;
    const works = await Work.find({
      _id: workId,
      account_id: id,
    });
    if (!works) {
      throw new NotFoundError(
        "We're sorry to let you know that we were unable to locate the requested work. Please double-check your entry of accurate information before attempting again. Please don't hesitate to contact our support staff if you need more help.",
      );
    }
    return response.status(StatusCodes.OK).json({ works });
  } catch (error: any) {
    next(error);
  }
}

/**
 * Get a resume of an account, everyone has rights
 */
async function resume(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const { id } = request.params;
    const resume = await Resume.findOne({ account_id: id });
    if (!resume) {
      throw new NotFoundError(
        "We regret the inconvenience, but we were unable to locate the requested resume. Please verify the information provided.",
      );
    }
    return response.status(StatusCodes.OK).json({ resume });
  } catch (error: any) {
    next(error);
  }
}
