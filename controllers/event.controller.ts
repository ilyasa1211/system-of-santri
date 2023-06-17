import { Calendar, Event, IEvent } from "../models";
import { StatusCodes } from "http-status-codes";
import { NotFoundError } from "../errors";
import findOrCreate from "../utils/find-or-create";
import MONTHS from "../traits/month";
import { NextFunction, Request, Response } from "express";

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
    const events = await Event.find() as Array<IEvent>;
    events.forEach((event) => {
      const { title, slug, date } = event;
      const [month, day] = date.split("-").slice(1);
      calendar.months[MONTHS[Number(month) - 1]][Number(day) - 1].event?.push({
        title,
        slug,
      });
    });

    response.status(StatusCodes.OK).json({ calendar });
  } catch (error: any) {
    next(error);
  }
}

/**
 * Get normal calendar
 */
async function index(request: Request, response: Response, next: NextFunction) {
  try {
    const events = await Event.find();
    response.status(StatusCodes.OK).json({ events });
  } catch (error: any) {
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
    response.status(StatusCodes.OK).json({
      message: "Congratulations! It was successful creating the event. ",
    });
  } catch (error: any) {
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
    const event = await Event.findById(id);
    if (!event) {
      throw new NotFoundError(
        "We regret the inconvenience, but we were unable to locate the requested event. Please double-check the event details or make sure you have provided accurate information.",
      );
    }
    Object.assign(event, request.body);
    await event.save();
    response.status(StatusCodes.OK).json({
      message:
        "Congratulations! The most recent changes have been successfully updated for the event. The required updates have been made.",
    });
  } catch (error: any) {
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
      message:
        "Congratulations! The most recent changes have been successfully updated for the event. The required updates have been made.",
    });
  } catch (error: any) {
    next(error);
  }
}
