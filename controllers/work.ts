import { Account, IAccount, Work } from "../models";
import { StatusCodes } from "http-status-codes";
import { authorize } from "../utils";
import { NextFunction, Request, Response } from "express";
import { NotFoundError } from "../traits/errors";
import { ResponseMessage } from "../traits/response";

export { destroy, index, insert, show, update };

/**
 * Get all works from all account, everyone has rights
 */
async function index(request: Request, response: Response, next: NextFunction) {
	try {
		const works = await Work.find().sort({ createdAt: "desc" });
		return response.status(StatusCodes.OK).json({ works });
	} catch (error: unknown) {
		next(error);
	}
}

/**
 * Show one work from id, everyone has rights
 */
async function show(request: Request, response: Response, next: NextFunction) {
	try {
		const { id } = request.params;
		const work = await Work.findById(id);
		if (!work) {
			throw new NotFoundError(ResponseMessage.WORK_NOT_FOUND);
		}
		return response.status(StatusCodes.OK).json({ work });
	} catch (error: unknown) {
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
		request.body.accountId = user.id;

		const work = await Work.create(request.body);
		const account = await Account.findById(user.id) as IAccount;

		account.workId.push(work.id);
		await account.save();

		return response.status(StatusCodes.OK).json({
			message: ResponseMessage.WORK_CREATED,
			work,
		});
	} catch (error: unknown) {
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
		const { params, body, user: account } = request;
		const { id } = params;
		const { title, link } = body;

		const work = await Work.findById(id);

		if (!work) {
			throw new NotFoundError(ResponseMessage.WORK_NOT_FOUND);
		}
		const updatedWork = { title, link };
		Object.assign(work, updatedWork);

		authorize(account as IAccount, work.accountId.toString());

		await work.save();
		return response.status(StatusCodes.OK).json({
			message: ResponseMessage.WORK_UPDATED,
		});
	} catch (error: unknown) {
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
			throw new NotFoundError(ResponseMessage.WORK_NOT_FOUND);
		}

		authorize(user, work.accountId.toString());

		await work.deleteOne();
		return response.status(StatusCodes.OK).json({
			message: ResponseMessage.WORK_DELETED,
		});
	} catch (error: unknown) {
		next(error);
	}
}
