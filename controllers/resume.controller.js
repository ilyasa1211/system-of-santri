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
    return response.status(StatusCodes.OK).json({ data: resumes });
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
    return response.status(StatusCodes.OK).json({ data: resume });
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
    if (hasResume) {
      throw new ConflictError(
        "We've noted that your resume is already on file. We are unable to produce new resumes for you repeatedly in accordance with our policy.",
      );
    }
    request.body.account_id = id;
    const resumes = await Resume.create(request.body);
    return response.status(StatusCodes.OK).json({
      message:
        "Congratulations on creating a successful resume! This crucial document will aid in showcasing your abilities, credentials, and experiences. ",
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
    return response.status(StatusCodes.OK).json({
      message:
        "You've done a great job updating your resume! You can make sure your resume accurately represents your skills and experiences by keeping it up-to-date and pertinent.",
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
    return response.status(StatusCodes.OK).json({
      message: "The deletion of your resume was successful. In order to protect the privacy and confidentiality of your information, it has been removed from our system.",
    });
  } catch (error) {
    next(error);
  }
}
