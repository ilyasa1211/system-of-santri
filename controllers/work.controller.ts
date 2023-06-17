import { Account, IAccount, Work } from "../models";
import { StatusCodes } from "http-status-codes";
import { authorize } from "../utils";
import { NextFunction, Request, Response } from "express";
import { NotFoundError } from "../errors";

export { destroy, index, insert, show, update };

/**
 * Get all works from all account, everyone has rights
 */
async function index(request: Request, response: Response, next: NextFunction) {
  try {
    const works = await Work.find({}, {}, { sort: { createdAt: "desc" } });
    return response.status(StatusCodes.OK).json({ works });
  } catch (error: any) {
    next(error);
  }
}

/**
 * Show one work from id, everyone has rights
 */
async function show(request: Request, response: Response, next: NextFunction) {
  try {
    const work = await Work.findOne({ _id: request.params.id });
    return response.status(StatusCodes.OK).json({ work });
  } catch (error: any) {
    next(error);
  }
}

/**
 * Create a new work, everyone has rights
 */
async function insert(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const user = request.user as IAccount;
    request.body.account_id = user.id;
    const works = await Work.create(request.body);
    const account = await Account.findById(user.id);
    account!.work.push(works.id);
    await account!.save();
    return response.status(StatusCodes.OK).json({
      message:
        "Congratulations on completing your work successfully! This is a noteworthy accomplishment that highlights your talent and commitment.",
      works,
    });
  } catch (error: any) {
    next(error);
  }
}

/**
 * Update the exisiting work, the owner of the work has rights
 */
async function update(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const { id } = request.params;
    const { title, link } = request.body;
    const user = request.user as IAccount;
    const work = await Work.findById(id);
    if (!work) {
      throw new NotFoundError(
        "We're sorry to let you know that we were unable to locate the requested work. Please double-check your entry of accurate information before attempting again. Please don't hesitate to contact our support staff if you need more help.",
      );
    }

    authorize(user, work.account_id.toString());
    if (title) work.title = title;
    if (link) work.link = link;
    work.updatedAt = Date.now().toString();
    await work.save();
    return response.status(StatusCodes.OK).json({
      message:
        "Congratulations on finishing your work update! Your dedication to honing and enhancing your work is admirable. ",
    });
  } catch (error: any) {
    next(error);
  }
}

/**
 * Delete a work permanently, the owner of the work has rights
 */
async function destroy(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const { id } = request.params;
    const user = request.user as IAccount;
    const work = await Work.findById(id);
    if (!work) {
      throw new NotFoundError(
        "We're sorry to let you know that we were unable to locate the requested work. Please double-check your entry of accurate information before attempting again. Please don't hesitate to contact our support staff if you need more help.",
      );
    }
    authorize(user, work.account_id.toString());
    await work.deleteOne();
    return response.status(StatusCodes.OK).json({
      message:
        "Your writing has been effectively erased. All related information has been permanently deleted, and it has been taken out of our records.",
    });
  } catch (error: any) {
    next(error);
  }
}
