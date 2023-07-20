import { Note } from "../models/note";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../traits/errors";
import { NextFunction, Request, Response } from "express";
import { ResponseMessage } from "../traits/response";

export { destroy, index, insert, show, update };

/**
 * Get all manager's notes
 */
async function index(request: Request, response: Response, next: NextFunction) {
	try {
		const notes = await Note.find();
		return response.status(StatusCodes.OK).json({ notes });
	} catch (error: any) {
		next(error);
	}
}

/**
 * Show one manager's note
 */
async function show(request: Request, response: Response, next: NextFunction) {
	try {
		const note = await Note.findById(request.params.id);
		return response.status(StatusCodes.OK).json({ note });
	} catch (error: any) {
		next(error);
	}
}

/**
 * Create a new notes, manager has rights
 */
async function insert(
	request: Request,
	response: Response,
	next: NextFunction,
) {
	try {
		const { id, note } = request.body;
		if (!id) {
			throw new BadRequestError(ResponseMessage.INVALID_LEARNING_ID);
		}
		if (!note) {
			throw new BadRequestError(ResponseMessage.NOTE_REQUIRED);
		}

		const learningExists = await Note.exists({ _id: id });
		if (!learningExists) {
			throw new NotFoundError(ResponseMessage.LEARNING_NOT_FOUND);
		}

		const notes = await Note.create(request.body);
		return response.status(StatusCodes.OK).json({
			message: ResponseMessage.NOTE_CREATED,
			notes,
		});
	} catch (error: any) {
		next(error);
	}
}

/**
 * Update the existing note, manager has rights
 */
async function update(
	request: Request,
	response: Response,
	next: NextFunction,
) {
	try {
		const notes = await Note.findByIdAndUpdate(request.params.id, request.body);
		return response.status(StatusCodes.OK).json({
			message: ResponseMessage.NOTE_UPDATED,
			notes,
		});
	} catch (error: any) {
		next(error);
	}
}

/**
 * Delete a note permanently, manager has rights
 */
async function destroy(
	request: Request,
	response: Response,
	next: NextFunction,
) {
	try {
		const notes = await Note.findByIdAndDelete(request.params.id);
		return response.status(StatusCodes.OK).json({
			message: ResponseMessage.NOTE_DELETED,
			notes,
		});
	} catch (error: any) {
		next(error);
	}
}
