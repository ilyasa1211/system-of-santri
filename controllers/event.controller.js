"use strict";

const { Calendar, Event } = require("../models");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError } = require("../errors");
const findOrCreate = require("../utils/find-or-create");
const MONTHS = require("../traits/month");

module.exports = { index, insert, update, destroy, calendar };

/**
 * Get event calendar
 * @param {Request} request
 * @param {Response} response
 * @param {VoidFunction} next
 */
async function calendar(request, response, next) {
  try {
    const year = new Date().getFullYear();
    const calendar = await findOrCreate(Calendar, { year });
    const events = await Event.find();
    events.forEach((event) => {
      const { title, slug, date } = event;
      const [month, day] = date.split("-").slice(1);
      calendar.months[MONTHS[month - 1]][day - 1].event?.push({ title, slug });
    });

    response.status(StatusCodes.OK).json({ calendar });
  } catch (error) {
    next(error);
  }
}

/**
 * Get normal calendar
 * @param {Request} request
 * @param {Response} response
 * @param {VoidFunction} next
 */
async function index(request, response, next) {
  try {
    const events = await Event.find();
    response.status(StatusCodes.OK).json({ events });
  } catch (error) {
    next(error);
  }
}

/**
 * Create an event
 * @param {Request} request
 * @param {Response} response
 * @param {VoidFunction} next
 */
async function insert(request, response, next) {
  try {
    await Event.create(request.body);
    response.status(StatusCodes.OK).json({
      message: "Event successfully created",
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Update an event
 * @param {Request} request
 * @param {Response} response
 * @param {VoidFunction} next
 */
async function update(request, response, next) {
  try {
    const { id } = request.params;
    const event = await Event.findById(id);
    if (!event) throw new NotFoundError("Event not found");
    Object.assign(event, request.body);
    await event.save();
    response.status(StatusCodes.OK).json({
      message: "Event successfully updated",
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Delete an event
 * @param {Request} request
 * @param {Response} response
 * @param {VoidFunction} next
 */
async function destroy(request, response, next) {
  try {
    const { id } = request.params;
    await Event.findOneAndDelete({ _id: id });
    response.status(StatusCodes.OK).json({
      message: "Event successfully deleted",
    });
  } catch (error) {
    next(error);
  }
}
