import jwt from "jsonwebtoken";
import fs from "node:fs";
import path from "node:path";
import { StatusCodes } from "http-status-codes";
import { NotFoundError } from "../traits/errors";
import argon2 from "argon2";
import { Account, IAccount, Resume, Work } from "../models";
import { authorize } from "../utils";
import { NextFunction, Request, Response } from "express";
import { ResponseMessage } from "../traits/response";
import { deletePhoto } from "../utils/delete-photo";
import { CallbackError } from "mongoose";

const projection = [
  "name",
  "email",
  "phoneNumber",
  "division",
  "status",
  "avatar",
  "santriPeriod",
  "generation",
  "generationYear",
  "role",
  "work",
  "absenses",
];

/**
 *  Get All Accounts, everyone has rights
 */
export async function index(request: Request, response: Response, next: NextFunction) {
  try {
    const accounts = await Account.find({ deletedAt: null })
      .select(
        projection,
      );
    return response.status(StatusCodes.OK).json({ accounts });
  } catch (error: any) {
    next(error);
  }
}
/**
 * Create an account to the database, only admin has rights
 */
export async function insert(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const { body, file } = request;
    const { name, email } = body;

    if (file) body.avatar = file.filename;

    body.verify = true;
    body.password = await argon2.hash(body.password, {
      type: argon2.argon2i,
    });
    const account = await Account.create(body);
    const { id } = account;
    const token = jwt.sign(
      { id, email, name },
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
export async function show(request: Request, response: Response, next: NextFunction) {
  try {
    const { id } = request.params;
    const account = await Account.findOne(
      { _id: id.replace(/[\W_]/g, ""), deletedAt: null },
    ).select(projection);
    return response.status(StatusCodes.OK).json({ account });
  } catch (error: any) {
    if (error.message.startsWith("Cast to ObjectId failed")) {
      error.message =
        "We apologize for the inconvenience, but the provided Account ID appears to be invalid. Please double-check the ID and ensure its accuracy.";
      error.code = StatusCodes.BAD_REQUEST;
    }
    next(error);
  }
}

/**
 * Update the existing account, the user of the account and admin has rights
 */
export async function update(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const { body, file } = request;
    const { id }: { id?: string } = request.params;
    authorize(request.user as IAccount, id);

    let isAvatarUpdate: boolean = false;
    if (file) {
      body.avatar = file.filename;
      isAvatarUpdate = true;
    };

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
export async function destroy(
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
      message: ResponseMessage.ACCOUNT_DELETED,
    });
  } catch (error: any) {
    next(error);
  }
}
/**
 * Show all deleted account, admin has rights
 */
export async function trash(request: Request, response: Response, next: NextFunction) {
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
export async function restore(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const { id }: { id?: string } = request.params;
    await Account.findByIdAndUpdate(id, { deletedAt: null });
    return response.status(StatusCodes.OK).json({ message: ResponseMessage.ACCOUNT_RESTORED });
  } catch (error: any) {
    next(error);
  }
}
/**
 * Delete one account PERMANENTLY be careful, admin has rights
 */
export async function eliminate(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const { id }: { id?: string } = request.params;

    Account.findByIdAndDelete(id, null, async (error: CallbackError, account: IAccount | null): Promise<void> => {
      if (error) throw error;
      debugger;
      if (account == null) throw new NotFoundError(ResponseMessage.ACCOUNT_NOT_FOUND);
      // account.deleteAvatar();
      debugger;
    })

    return response.status(StatusCodes.OK).json({ message: ResponseMessage.ACCOUNT_DELETED_PERMANENT });
  } catch (error: any) {
    next(error);
  }
}
/**
 * Get information about my account, everyone has rights
 */
export async function profile(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const { id } = request.user as IAccount;
    const account = await Account.findById(id)
      .select(projection)
      .populate({
        path: "role",
        foreignField: "id",
        select: "-_id id name",
      })
      .exec();
    if (!account) {
      throw new NotFoundError(
        ResponseMessage.ACCOUNT_NOT_FOUND,
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
export async function workIndex(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const { id } = request.params;
    const works = await Work.find({ account_id: id }).exec();

    return response.json({ works });
  } catch (error: any) {
    next(error);
  }
}

/**
 * Get a work about an account, everyone has rights
 */
export async function workShow(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const { workId, id } = request.params;
    const works = await Work.find({
      _id: workId,
      account_id: id,
    }).exec();
    if (!works) {
      throw new NotFoundError(
        "We're sorry to let you know that we were unable to locate the requested work. Please double-check your entry of accurate information before attempting again.",
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
export async function resume(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const { id } = request.params;
    const resume = await Resume.findOne({ account_id: id }).exec();
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
