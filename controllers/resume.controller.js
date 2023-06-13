"use strict";

/**
 * @type {import('mongoose').Model}
 */
const { Resume } = require("../models");
const { StatusCodes } = require("http-status-codes");
const { ConflictError } = require("../errors");
const { authorize } = require("../utils");

module.exports = { index, show, insert, destroy, update };

/**
 * Get resume from all account, everyone has rights
 * @param {Request} request
 * @param {Response} response
 * @param {VoidFunction} next
 */
async function index(request, response, next) {
  try {
    const resumes = await Resume.find({}, {}, { sort: { createdAt: "desc" } });
    response.status(StatusCodes.OK).json({ data: resumes });
  } catch (error) {
    next(error);
  }
}

/**
 * Show one resume from the given id, everyone has rights
 * @param {Request} request
 * @param {Response} response
 * @param {VoidFunction} next
 */
async function show(request, response, next) {
  try {
    const resume = await Resume.findOne({ _id: request.params.id });
    response.status(StatusCodes.OK).json({ data: resume });
  } catch (error) {
    next(error);
  }
}

/**
 * Create a new resume for an account, everyone has rights
 * @param {Request} request
 * @param {Response} response
 * @param {VoidFunction} next
 */
async function insert(request, response, next) {
  try {
    const { id } = request.user;
    const hasResume = await Resume.exists({ account_id: id });
    if (hasResume) throw new ConflictError("Already have resume");
    request.body.account_id = id;
    const resumes = await Resume.create(request.body);
    response.status(StatusCodes.OK).json({
      message: "Success creating resume!",
      data: resumes,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Update the existing resume, the owner of the resume has rights
 * @param {Request} request
 * @param {Response} response
 * @param {VoidFunction} next
 */
async function update(request, response, next) {
  try {
    const { id } = request.params;
    const { technicalSkill, education, personalBackground, experience } =
      request.body;
    const resume = await Resume.findById(id);
    authorize(request.user, resume.account_id.toString());
    if (technicalSkill) resume.technical_skill = technicalSkill;
    if (education) resume.education = education;
    if (personalBackground) resume.personal_background = personalBackground;
    if (experience) resume.experience = experience;
    await resume.save();
    response.status(StatusCodes.OK).json({
      message: "Success updating resume!",
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Delete a resume permanently by id, the owner of the resume has rights
 * @param {Request} request
 * @param {Response} response
 * @param {VoidFunction} next
 */
async function destroy(request, response, next) {
  try {
    const { id } = request.params;
    const resume = await Resume.findById(id);
    authorize(request.user, resume.account_id.toString());
    response.status(StatusCodes.OK).json({
      message: "Success deleting resume!",
    });
  } catch (error) {
    next(error);
  }
}
