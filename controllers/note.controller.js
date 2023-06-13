"use strict";

const Note = require("../models/note.model");

const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

module.exports = { index, insert, update, destroy, show };

/**
 * Get all manager's notes
 * @param {Request} request
 * @param {Response} response
 * @param {VoidFunction} next
 */
async function index(request, response, next) {
  try {
    const notes = await Note.find();
    return response.status(StatusCodes.OK).json({ notes });
  } catch (error) {
    next(error);
  }
}

/**
 * Show one manager's note
 * @param {Request} request
 * @param {Response} response
 * @param {VoidFunction} next
 */
async function show(request, response, next) {
  try {
    const note = await Note.findById(request.params.id);
    return response.status(StatusCodes.OK).json({ note });
  } catch (error) {
    next(error);
  }
}

/**
 * Create a new notes, manager has rights
 * @param {Request} request
 * @param {Response} response
 * @param {VoidFunction} next
 */
async function insert(request, response, next) {
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
  } catch (error) {
    next(error);
  }
}

/**
 * Update the existing note, manager has rights
 * @param {Request} request
 * @param {Response} response
 * @param {VoidFunction} next
 */
async function update(request, response, next) {
  try {
    const notes = await Note.findByIdAndUpdate(request.params.id, request.body);
    return response.status(StatusCodes.OK).json({
      message:
        "Congratulations on finishing the note update! It is admirable how dedicated you are to keeping the information current and pertinent.",
      notes,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Delete a note permanently, manager has rights
 * @param {Request} request
 * @param {Response} response
 * @param {VoidFunction} next
 */
async function destroy(request, response, next) {
  try {
    const notes = await Note.findByIdAndDelete(request.params.id);
    return response.status(StatusCodes.OK).json({
      message:
        "The note was effectively erased. All related data has been permanently deleted and it has been removed from the system.",
      notes,
    });
  } catch (error) {
    next(error);
  }
}
