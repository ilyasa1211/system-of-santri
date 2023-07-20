import { Calendar, Event, IEvent } from "../models";
import { StatusCodes } from "http-status-codes";
import { NotFoundError } from "../traits/errors";
import findOrCreate from "../utils/find-or-create";
import MONTHS from "../traits/month";
import { NextFunction, Request, Response } from "express";
import { ResponseMessage } from "../traits/response";
import { CallbackError } from "mongoose";

export { calendar, destroy, index, insert, update };

/**
 * Get event calendar
 */
async function calendar(
	request: Request,
	response: Response,
	next: NextFunction,
) {
	try {
		const year: number = new Date().getFullYear();
		const calendar = await findOrCreate(Calendar, { year });
		const events = (await Event.find()) as Array<IEvent>;
		events.forEach((event) => {
			const { title, slug, date } = event;
			const [month, day] = date.split("-").slice(1);
			calendar.months[MONTHS[Number(month) - 1]][Number(day) - 1].event?.push({
				title,
				slug,
			});
		});

		return response.status(StatusCodes.OK).json({ calendar });
	} catch (error: unknown) {
		next(error);
	}
}

/**
 * Get normal calendar
 */
async function index(request: Request, response: Response, next: NextFunction) {
	try {
		const events = await Event.find();
		return response.status(StatusCodes.OK).json({ events });
	} catch (error: unknown) {
		next(error);
	}
}

/**
 * Create an event
 */
async function insert(
	request: Request,
	response: Response,
	next: NextFunction,
) {
	try {
		await Event.create(request.body);
		return response.status(StatusCodes.CREATED).json({
			message: ResponseMessage.EVENT_CREATED,
		});
	} catch (error: unknown) {
		next(error);
	}
}

/**
 * Update an event
 */
async function update(
	request: Request,
	response: Response,
	next: NextFunction,
) {
	try {
		const { id } = request.params;
		Event.findByIdAndUpdate(
			id,
			request.body,
			(error: CallbackError, event: IEvent): void => {
				if (error) throw error;
				if (!event) throw new NotFoundError(ResponseMessage.EVENT_NOT_FOUND);
			},
		);

		return response.status(StatusCodes.OK).json({
			message: ResponseMessage.EVENT_UPDATED,
		});
	} catch (error: unknown) {
		next(error);
	}
}

/**
 * Delete an event
 */
async function destroy(
	request: Request,
	response: Response,
	next: NextFunction,
) {
	try {
		const { id } = request.params;
		await Event.findOneAndDelete({ _id: id });
		return response.status(StatusCodes.OK).json({
			message: ResponseMessage.EVENT_UPDATED,
		});
	} catch (error: unknown) {
		next(error);
	}
}
