import { Learning } from "../models";
import { StatusCodes } from "http-status-codes";
import fs from "node:fs";
import path from "node:path";
import { NextFunction, Request, Response } from "express";
import { BadRequestError, NotFoundError } from "../traits/errors";

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
    const { id } = request.params;
    const learning = await Learning.findById(id);
    if (!learning) {
      throw new NotFoundError(
        "We regret any inconvenience this may have caused, but it doesn't seem like the requested lesson was available. ",
      );
    }
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
    const { body, file } = request;

    !body.thumbnail && delete body.thumbnail;
    if (file) {
      const { path } = file;
      body.thumbnail = path.slice(path.indexOf("images"));
    }
    await Learning.create(body);
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
    const { body, file, params } = request;
    const { id } = params;
    if (file) {
      const { path } = file;
      body.thumbnail = path.slice(path.indexOf("images"));
    }
    const learning = await Learning.findById(id);
    if (!learning) {
      throw new NotFoundError(
        "We regret any inconvenience this may have caused, but it doesn't seem like the requested lesson was available. ",
      );
    }
    Object.assign(learning, body);
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
    const { id } = request.params;
    const learning = await Learning.findById(id);
    if (!learning) {
      throw new NotFoundError(
        "We regret any inconvenience this may have caused, but it doesn't seem like the requested lesson was available.",
      );
    }

    const { thumbnail } = learning;

    await learning.deleteOne();

    if (!thumbnail.endsWith(String(process.env.DEFAULT_THUMBNAIL_NAME))) {
      fs.unlink(
        path.join(__dirname, "..", "public", thumbnail),
        (error: any) => {
          if (error) throw error;
        },
      );
    }
    return response.status(StatusCodes.OK).json({
      message:
        "The deletion of your lesson was successful. The learning platform has removed it, and all associated data has been permanently deleted.",
    });
  } catch (error: any) {
    next(error);
  }
}
