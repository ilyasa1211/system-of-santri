"use strict";

const { Learning } = require("../models");
const { StatusCodes } = require("http-status-codes");
const fs = require("node:fs");
const path = require("node:path");
const NotFoundError = require("../errors/not-found");

module.exports = { index, insert, update, destroy, show };

/**
 * Get all learnings, everyone has rights
 * @param {Request} request
 * @param {Response} response
 * @param {VoidFunction} next
 */
async function index(request, response, next) {
  try {
    const learnings = await Learning.find();
    response.status(StatusCodes.OK).json({ learnings });
  } catch (error) {
    next(error);
  }
}

/**
 * Show one learning, everyone has rights
 * @param {Request} request
 * @param {Response} response
 * @param {VoidFunction} next
 */
async function show(request, response, next) {
  try {
    const learning = await Learning.findById(request.params.id);
    response.status(StatusCodes.OK).json({ learning });
  } catch (error) {
    next(error);
  }
}

/**
 * Create a new learning, manager has rights
 * @param {Request} request
 * @param {Response} response
 * @param {VoidFunction} next
 */
async function insert(request, response, next) {
  try {
    if (request.file) {
      request.body.thumbnail = request.file.filename;
    }
    await Learning.create(request.body);
    response.status(StatusCodes.OK).json({ message: "Success Created!" });
  } catch (error) {
    next(error);
  }
}

/**
 * Update an existing learning, manager has rights
 * @param {Request} request
 * @param {Response} response
 * @param {VoidFunction} next
 */
async function update(request, response, next) {
  try {
    if (request.file) {
      request.body.thumbnail = request.file.filename;
    }
    const learning = await Learning.findById(request.params.id);
    if (!learning) throw NotFoundError("Learning not found");
    Object.assign(learning, request.body);
    await learning.save();
    response.status(StatusCodes.OK).json({ message: "Success Updated!" });
  } catch (error) {
    next(error);
  }
}

/**
 * Delete a learning, manager has rights
 * @param {Request} request
 * @param {Response} response
 * @param {VoidFunction} next
 */
async function destroy(request, response, next) {
  try {
    const learning = await Learning.findById(request.params.id);
    if (!learning) throw new NotFoundError("Learning not found");
    const { thumbnail } = learning;
    if (thumbnail && thumbnail !== "default-thumbnail.jpg") {
      fs.unlink(
        path.join(
          __dirname,
          "..",
          "public",
          "images",
          process.env.SAVE_LEARNING_THUMBNAIL,
          thumbnail,
        ),
        (error) => {
          if (error) throw error;
        },
      );
    }
    await learning.deleteOne();
    response.status(StatusCodes.OK).json({ message: "Success Deleted!" });
  } catch (error) {
    next(error);
  }
}
