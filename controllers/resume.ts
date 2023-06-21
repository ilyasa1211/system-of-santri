import { IAccount, Resume } from "../models";
import { StatusCodes } from "http-status-codes";
import { ConflictError, NotFoundError } from "../traits/errors";
import { authorize } from "../utils";
import { NextFunction, Request, Response } from "express";

export { destroy, index, insert, show, update };

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
        "We regret the inconvenience, but we were unable to locate the requested resume. Please verify the information provided.",
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
      throw new ConflictError(
        "We've noted that your resume is already on file. We are unable to produce new resumes for you repeatedly in accordance with our policy.",
      );
    }
    request.body.account_id = id;
    const resume = await Resume.create(request.body);
    return response.status(StatusCodes.OK).json({
      message:
        "Congratulations on creating a successful resume! This crucial document will aid in showcasing your abilities, credentials, and experiences. ",
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
        "We regret the inconvenience, but we were unable to locate the requested resume. Please verify the information provided.",
      );
    }

    authorize(request.user as IAccount, resume.account_id.toString());
    Object.assign(resume, updatedValue);

    await resume.save();

    return response.status(StatusCodes.OK).json({
      message:
        "You've done a great job updating your resume! You can make sure your resume accurately represents your skills and experiences by keeping it up-to-date and pertinent.",
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
        "We regret the inconvenience, but we were unable to locate the requested resume. Please verify the information provided.",
      );
    }

    authorize(request.user as IAccount, resume.account_id.toString());
    return response.status(StatusCodes.OK).json({
      message:
        "The deletion of your resume was successful. In order to protect the privacy and confidentiality of your information, it has been removed from our system.",
    });
  } catch (error: any) {
    next(error);
  }
}
