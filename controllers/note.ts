import Note from "../models/note";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../traits/errors";
import { NextFunction, Request, Response } from "express";

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
      throw new BadRequestError(
        "We apologize for the inconvenience, but the provided lesson ID appears to be invalid. Please double-check the ID and ensure its accuracy.",
      );
    }
    if (!note) {
      throw new BadRequestError(
        "We apologize for the oversight. It seems that the note field is a required field for this operation. Please make sure to provide a note or additional information related to the lesson. ",
      );
    }
    const learningExists = await Note.exists({ _id: id });
    if (!learningExists) {
      throw new NotFoundError(
        "We regret any inconvenience this may have caused, but it doesn't seem like the requested lesson was available.",
      );
    }
    const notes = await Note.create(request.body);
    return response.status(StatusCodes.OK).json({
      message:
        "You've done a great job making the notes, congratulations! Your thorough writing will make a significant difference in how well students learn.",
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
      message:
        "Congratulations on finishing the note update! It is admirable how dedicated you are to keeping the information current and pertinent.",
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
      message:
        "The note was effectively erased. All related data has been permanently deleted and it has been removed from the system.",
      notes,
    });
  } catch (error: any) {
    next(error);
  }
}
