import { IAccount, Resume } from "../models";
import { StatusCodes } from "http-status-codes";
import { ConflictError, NotFoundError } from "../traits/errors";
import { authorize } from "../utils";
import { NextFunction, Request, Response } from "express";
import { ResponseMessage } from "../traits/response";

export { destroy, index, insert, show, update, getByAccount };

/**
 * Get resume from all account, everyone has rights
 */
async function index(request: Request, response: Response, next: NextFunction) {
  try {
    const resumes = await Resume.find({}, {}, { sort: { createdAt: "desc" } });
    return response.status(StatusCodes.OK).json({ data: resumes });
  } catch (error: any) {
    next(error);
  }
}

/**
 * Show one resume from the given id, everyone has rights
 */
async function show(request: Request, response: Response, next: NextFunction) {
  try {
    const { id } = request.params;
    const resume = await Resume.findById(id);
    if (!resume) {
      throw new NotFoundError(
        ResponseMessage.RESUME_NOT_FOUND,
      );
    }
    return response.status(StatusCodes.OK).json({ data: resume });
  } catch (error: any) {
    next(error);
  }
}

/**
 * Create a new resume for an account, everyone has rights
 */
async function insert(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const { id } = request.user as IAccount;
    const hasResume = await Resume.exists({ account_id: id });
    if (hasResume) {
      throw new ConflictError(ResponseMessage.RESUME_CONFLICT);
    }
    request.body.account_id = id;
    const resume = await Resume.create(request.body);
    return response.status(StatusCodes.OK).json({
      message: ResponseMessage.RESUME_CREATED,
      resume,
    });
  } catch (error: any) {
    next(error);
  }
}

/**
 * Update the existing resume, the owner of the resume has rights
 */
async function update(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const { id } = request.params;
    const {
      technicalSkill: technical_skill,
      education,
      personalBackground: personal_background,
      experience,
    } = request.body;

    const updatedValue = {
      technical_skill,
      education,
      personal_background,
      experience,
    };
    const resume = await Resume.findById(id);
    if (!resume) {
      throw new NotFoundError(
        ResponseMessage.RESUME_NOT_FOUND,
      );
    }

    authorize(request.user as IAccount, resume.account_id.toString());
    Object.assign(resume, updatedValue);

    await resume.save();

    return response.status(StatusCodes.OK).json({
      message: ResponseMessage.RESUME_UPDATED,
    });
  } catch (error: any) {
    next(error);
  }
}

/**
 * Delete a resume permanently by id, the owner of the resume has rights
 */
async function destroy(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const { id } = request.params;
    const resume = await Resume.findById(id);
    if (!resume) {
      throw new NotFoundError(
        ResponseMessage.RESUME_NOT_FOUND,
      );
    }

    authorize(request.user as IAccount, resume.account_id.toString());
    return response.status(StatusCodes.OK).json({
      message: ResponseMessage.RESUME_DELETED,
    });
  } catch (error: any) {
    next(error);
  }
}

async function getByAccount(request: Request, response: Response, next: NextFunction) {
  try {
    const { accountUniqueId } = request.params;
    
    const resume = await Resume.findOne({ account_id: accountUniqueId }).exec()

    if (!resume) {
      throw new NotFoundError(ResponseMessage.RESUME_NOT_FOUND);
    }
    return response.status(StatusCodes.OK).json({ resume });
  } catch (error) {
    next(error)
  }
}