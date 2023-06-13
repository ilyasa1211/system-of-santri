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
    response.status(StatusCodes.OK).json({ notes });
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
    response.status(StatusCodes.OK).json({ note });
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
    if (!id) throw new BadRequestError("Invalid Learning");
    if (!note) throw new BadRequestError("Note field required");
    const learningExists = await Note.exists({ _id: id });
    if (!learningExists) throw new NotFoundError("Learning not found");
    const notes = await Note.create(request.body);
    response.status(StatusCodes.OK).json({ message: "Created!", notes });
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
    response.status(StatusCodes.OK).json({ message: "Updated!", notes });
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
    response.status(StatusCodes.OK).json({ message: "Deleted!", notes });
  } catch (error) {
    next(error);
  }
}
