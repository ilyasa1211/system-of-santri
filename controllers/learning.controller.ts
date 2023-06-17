import { Learning } from "../models";
import { StatusCodes } from "http-status-codes";
import fs from "node:fs";
import path from "node:path";
import { NextFunction, Request, Response } from "express";
import NotFoundError from "../errors/not-found";

export { destroy, index, insert, show, update };

/**
 * Get all learnings, everyone has rights
 */
async function index(request: Request, response: Response, next: NextFunction) {
  try {
    const learnings = await Learning.find();
    return response.status(StatusCodes.OK).json({ learnings });
  } catch (error: any) {
    next(error);
  }
}

/**
 * Show one learning, everyone has rights
 */
async function show(request: Request, response: Response, next: NextFunction) {
  try {
    const learning = await Learning.findById(request.params.id);
    return response.status(StatusCodes.OK).json({ learning });
  } catch (error: any) {
    next(error);
  }
}

/**
 * Create a new learning, manager has rights
 */
async function insert(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    if (request.file) {
      request.body.thumbnail = request.file.filename;
    }
    await Learning.create(request.body);
    return response.status(StatusCodes.OK).json({
      message:
        "Congratulations on developing a lesson successfully! Your commitment to education and knowledge sharing is admirable. ",
    });
  } catch (error: any) {
    next(error);
  }
}

/**
 * Update an existing learning, manager has rights
 */
async function update(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    if (request.file) {
      request.body.thumbnail = request.file.filename;
    }
    const learning = await Learning.findById(request.params.id);
    if (!learning) {
      throw new NotFoundError(
        "We regret any inconvenience this may have caused, but it doesn't seem like the requested lesson was available. ",
      );
    }
    Object.assign(learning, request.body);
    await learning.save();
    return response.status(StatusCodes.OK).json({
      message:
        "Congratulations on finishing up your lesson update! Your commitment to enhancing and perfecting the instructional materials is admirable.",
    });
  } catch (error: any) {
    next(error);
  }
}

/**
 * Delete a learning, manager has rights
 */
async function destroy(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const learning = await Learning.findById(request.params.id);
    if (!learning) {
      throw new NotFoundError(
        "We regret any inconvenience this may have caused, but it doesn't seem like the requested lesson was available.",
      );
    }
    const { thumbnail } = learning;
    if (thumbnail && thumbnail !== "default-thumbnail.jpg") {
      const saveLearningThumbnail = process.env.SAVE_LEARNING_THUMBNAIL as string;
      fs.unlink(
        path.join(
          __dirname,
          "..",
          "public",
          "images",
          saveLearningThumbnail,
          thumbnail,
        ),
        (error: any) => {
          if (error) throw error;
        },
      );
    }
    await learning.deleteOne();
    return response.status(StatusCodes.OK).json({
      message:
        "The deletion of your lesson was successful. The learning platform has removed it, and all associated data has been permanently deleted.",
    });
  } catch (error: any) {
    next(error);
  }
}
