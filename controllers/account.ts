import { StatusCodes } from "http-status-codes";
import { NotFoundError } from "../traits/errors";
import { Account, IAccount, Resume, Work } from "../models";
import { authorize } from "../utils";
import { NextFunction, Request, Response } from "express";
import { ResponseMessage } from "../traits/response";
import { deletePhoto } from "../utils/delete-photo";
import { CallbackError } from "mongoose";
import { getPopulationOptionsFromRequestQuery } from "../utils/get-population-options-from-request-query";
import { hashPassword } from "../utils/hash-password";
import { generateJwtToken } from "../utils/generate-jwt-token";

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
  "absense",
];

/**
 *  Get All Accounts, everyone has rights
 */
export async function index(request: Request, response: Response, next: NextFunction) {
  try {
    const fieldsToPopulate = getPopulationOptionsFromRequestQuery(request);

    const accounts = await Account.find({ deletedAt: null, verify: true })
    .select(projection)
    .populate(fieldsToPopulate)
    .exec();

    return response.status(StatusCodes.OK).json({ accounts });
  } catch (error: any){
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

    if (file) body.avatar = file.filename;

    body.verify = true;
    body.password = hashPassword(body.password);

    const account = await Account.create(body);
    const token = generateJwtToken(account);

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

    const fieldsToPopulate = getPopulationOptionsFromRequestQuery(request);

    const account = await Account.findOne({ _id: id, deletedAt: null, verify: true })
    .select(projection)
    .populate(fieldsToPopulate)
    .exec();

    return response.status(StatusCodes.OK).json({ account });
  } catch (error: any) {
    if (error.message.startsWith("Cast to ObjectId failed")) {
      error.message = ResponseMessage.INVALID_ACCOUNT_ID;
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
    const { body, file, user } = request;
    const { id }: { id?: string } = request.params;

    authorize(user as IAccount, id);

    let isAvatarUpdate: boolean = false;
    
    if (file) {
      body.avatar = file.filename;
      isAvatarUpdate = true;
    };
    if (body.password) {
      body.password = await hashPassword(body.password);
    }

    Account.findOneAndUpdate({ _id: id, deletedAt: null }, request.body, { returnDocument: "before" }, function (error: CallbackError, oldAccount: IAccount | null): void {
      if (error) throw error;
      if (oldAccount && isAvatarUpdate) {
        deletePhoto(oldAccount.avatar);
      }
    });

    return response.status(StatusCodes.OK).json({
      message: ResponseMessage.ACCOUNT_UPDATED,
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
    ).exec();

    return response.status(StatusCodes.ACCEPTED).json({ message: ResponseMessage.ACCOUNT_DELETED });
  } catch (error: any) {
    next(error);
  }
}
/**
 * Show all deleted account, admin has rights
 */
export async function trash(request: Request, response: Response, next: NextFunction) {
  try {
    const accounts = await Account.find({ deletedAt: { $ne: null } }).exec();
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
    await Account.findByIdAndUpdate(id, { deletedAt: null }).exec();
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

    Account.findByIdAndDelete({ _id: id, deletedAt: { $ne: null }}, null, (error: CallbackError, account: IAccount | null): void => {
      if (error) throw error;
      if (!account) throw new NotFoundError(ResponseMessage.ACCOUNT_NOT_FOUND);
      deletePhoto(account.avatar);
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
    const fieldsToPopulate = getPopulationOptionsFromRequestQuery(request);

    const account = await Account.find({ _id: id, deletedAt: null })
    .select(projection)
    .populate(fieldsToPopulate)
    .exec();

    if (!account) {
      throw new NotFoundError(ResponseMessage.ACCOUNT_NOT_FOUND);
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
      throw new NotFoundError(ResponseMessage.WORK_NOT_FOUND);
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
      throw new NotFoundError(ResponseMessage.RESUME_NOT_FOUND);
    }

    return response.status(StatusCodes.OK).json({ resume });
  } catch (error: any) {
    next(error);
  }
}
