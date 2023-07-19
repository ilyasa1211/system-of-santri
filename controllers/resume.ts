import { IAccount, Resume } from "../models";
import { StatusCodes } from "http-status-codes";
import { ConflictError, NotFoundError } from "../traits/errors";
import { authorize } from "../utils";
import { NextFunction, Request, Response } from "express";
import { ResponseMessage } from "../traits/response";
import { CallbackError } from "mongoose";

export { destroy, getByAccount, index, insert, show, update };

/**
 * Get resume from all account, everyone has rights
 */
async function index(request: Request, response: Response, next: NextFunction) {
	try {
		const resumes = await Resume.find({}, null).sort({ createdAt: "desc" })
			.exec();
		return response.status(StatusCodes.OK).json({ resumes });
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
		const resume = await Resume.findById(id).exec();

		if (!resume) {
			throw new NotFoundError(
				ResponseMessage.RESUME_NOT_FOUND,
			);
		}
		return response.status(StatusCodes.OK).json({ resume });
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
		const { id: account_id } = request.user as IAccount;

		Resume.exists({ account_id }, (error: CallbackError, resumeId) => {
			if (error) throw error;
			if (resumeId) {
				throw new ConflictError(ResponseMessage.RESUME_CONFLICT);
			}
		});

		request.body.account_id = account_id;

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

		const resume = await Resume.findById(id);
		if (!resume) {
			throw new NotFoundError(ResponseMessage.RESUME_NOT_FOUND);
		}

		authorize(request.user as IAccount, resume.accountId.toString());

		Object.assign(resume, request.body);

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
		const { user, params } = request;
		const { id } = params;

		const resume = await Resume.findById(id).select("account_id -_id").exec();
		if (!resume) {
			throw new NotFoundError(ResponseMessage.RESUME_NOT_FOUND);
		}

		authorize(user as IAccount, resume.accountId.toString());

		return response.status(StatusCodes.OK).json({
			message: ResponseMessage.RESUME_DELETED,
		});
	} catch (error: any) {
		next(error);
	}
}

async function getByAccount(
	request: Request,
	response: Response,
	next: NextFunction,
) {
	try {
		const { accountUniqueId } = request.params;

		const resume = await Resume.findOne({ account_id: accountUniqueId }).exec();

		if (!resume) {
			throw new NotFoundError(ResponseMessage.RESUME_NOT_FOUND);
		}
		return response.status(StatusCodes.OK).json({ resume });
	} catch (error) {
		next(error);
	}
}
