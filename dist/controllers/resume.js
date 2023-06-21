"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.update = exports.show = exports.insert = exports.index = exports.destroy = void 0;
const models_1 = require("../models");
const http_status_codes_1 = require("http-status-codes");
const errors_1 = require("../traits/errors");
const utils_1 = require("../utils");
/**
 * Get resume from all account, everyone has rights
 */
function index(request, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const resumes = yield models_1.Resume.find({}, {}, { sort: { createdAt: "desc" } });
            return response.status(http_status_codes_1.StatusCodes.OK).json({ data: resumes });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.index = index;
/**
 * Show one resume from the given id, everyone has rights
 */
function show(request, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = request.params;
            const resume = yield models_1.Resume.findById(id);
            if (!resume) {
                throw new errors_1.NotFoundError("We regret the inconvenience, but we were unable to locate the requested resume. Please verify the information provided.");
            }
            return response.status(http_status_codes_1.StatusCodes.OK).json({ data: resume });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.show = show;
/**
 * Create a new resume for an account, everyone has rights
 */
function insert(request, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = request.user;
            const hasResume = yield models_1.Resume.exists({ account_id: id });
            if (hasResume) {
                throw new errors_1.ConflictError("We've noted that your resume is already on file. We are unable to produce new resumes for you repeatedly in accordance with our policy.");
            }
            request.body.account_id = id;
            const resume = yield models_1.Resume.create(request.body);
            return response.status(http_status_codes_1.StatusCodes.OK).json({
                message: "Congratulations on creating a successful resume! This crucial document will aid in showcasing your abilities, credentials, and experiences. ",
                resume,
            });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.insert = insert;
/**
 * Update the existing resume, the owner of the resume has rights
 */
function update(request, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = request.params;
            const { technicalSkill: technical_skill, education, personalBackground: personal_background, experience, } = request.body;
            const updatedValue = {
                technical_skill,
                education,
                personal_background,
                experience,
            };
            const resume = yield models_1.Resume.findById(id);
            if (!resume) {
                throw new errors_1.NotFoundError("We regret the inconvenience, but we were unable to locate the requested resume. Please verify the information provided.");
            }
            (0, utils_1.authorize)(request.user, resume.account_id.toString());
            Object.assign(resume, updatedValue);
            yield resume.save();
            return response.status(http_status_codes_1.StatusCodes.OK).json({
                message: "You've done a great job updating your resume! You can make sure your resume accurately represents your skills and experiences by keeping it up-to-date and pertinent.",
            });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.update = update;
/**
 * Delete a resume permanently by id, the owner of the resume has rights
 */
function destroy(request, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = request.params;
            const resume = yield models_1.Resume.findById(id);
            if (!resume) {
                throw new errors_1.NotFoundError("We regret the inconvenience, but we were unable to locate the requested resume. Please verify the information provided.");
            }
            (0, utils_1.authorize)(request.user, resume.account_id.toString());
            return response.status(http_status_codes_1.StatusCodes.OK).json({
                message: "The deletion of your resume was successful. In order to protect the privacy and confidentiality of your information, it has been removed from our system.",
            });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.destroy = destroy;
