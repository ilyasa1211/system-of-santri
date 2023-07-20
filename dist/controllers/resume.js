"use strict";
var __awaiter =
	(this && this.__awaiter) ||
	function (thisArg, _arguments, P, generator) {
		function adopt(value) {
			return value instanceof P
				? value
				: new P(function (resolve) {
						resolve(value);
				  });
		}
		return new (P || (P = Promise))(function (resolve, reject) {
			function fulfilled(value) {
				try {
					step(generator.next(value));
				} catch (e) {
					reject(e);
				}
			}
			function rejected(value) {
				try {
					step(generator["throw"](value));
				} catch (e) {
					reject(e);
				}
			}
			function step(result) {
				result.done
					? resolve(result.value)
					: adopt(result.value).then(fulfilled, rejected);
			}
			step((generator = generator.apply(thisArg, _arguments || [])).next());
		});
	};
Object.defineProperty(exports, "__esModule", { value: true });
exports.update =
	exports.show =
	exports.insert =
	exports.index =
	exports.getByAccount =
	exports.destroy =
		void 0;
const models_1 = require("../models");
const http_status_codes_1 = require("http-status-codes");
const errors_1 = require("../traits/errors");
const utils_1 = require("../utils");
const response_1 = require("../traits/response");
/**
 * Get resume from all account, everyone has rights
 */
function index(request, response, next) {
	return __awaiter(this, void 0, void 0, function* () {
		try {
			const resumes = yield models_1.Resume.find({}, null)
				.sort({ createdAt: "desc" })
				.exec();
			return response
				.status(http_status_codes_1.StatusCodes.OK)
				.json({ resumes });
		} catch (error) {
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
			const resume = yield models_1.Resume.findById(id).exec();
			if (!resume) {
				throw new errors_1.NotFoundError(
					response_1.ResponseMessage.RESUME_NOT_FOUND,
				);
			}
			return response
				.status(http_status_codes_1.StatusCodes.OK)
				.json({ resume });
		} catch (error) {
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
			const { id: accountId } = request.user;
			models_1.Resume.exists({ accountId }, (error, resumeId) => {
				if (error) throw error;
				if (resumeId) {
					throw new errors_1.ConflictError(
						response_1.ResponseMessage.RESUME_CONFLICT,
					);
				}
			});
			request.body.accountId = accountId;
			const resume = yield models_1.Resume.create(request.body);
			return response.status(http_status_codes_1.StatusCodes.OK).json({
				message: response_1.ResponseMessage.RESUME_CREATED,
				resume,
			});
		} catch (error) {
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
			const resume = yield models_1.Resume.findById(id);
			if (!resume) {
				throw new errors_1.NotFoundError(
					response_1.ResponseMessage.RESUME_NOT_FOUND,
				);
			}
			(0, utils_1.authorize)(request.user, resume.accountId.toString());
			Object.assign(resume, request.body);
			yield resume.save();
			return response.status(http_status_codes_1.StatusCodes.OK).json({
				message: response_1.ResponseMessage.RESUME_UPDATED,
			});
		} catch (error) {
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
			const { user, params } = request;
			const { id } = params;
			const resume = yield models_1.Resume.findById(id)
				.select("accountId -_id")
				.exec();
			if (!resume) {
				throw new errors_1.NotFoundError(
					response_1.ResponseMessage.RESUME_NOT_FOUND,
				);
			}
			(0, utils_1.authorize)(user, resume.accountId.toString());
			return response.status(http_status_codes_1.StatusCodes.OK).json({
				message: response_1.ResponseMessage.RESUME_DELETED,
			});
		} catch (error) {
			next(error);
		}
	});
}
exports.destroy = destroy;
function getByAccount(request, response, next) {
	return __awaiter(this, void 0, void 0, function* () {
		try {
			const { accountUniqueId } = request.params;
			const resume = yield models_1.Resume.findOne({
				accountId: accountUniqueId,
			}).exec();
			if (!resume) {
				throw new errors_1.NotFoundError(
					response_1.ResponseMessage.RESUME_NOT_FOUND,
				);
			}
			return response
				.status(http_status_codes_1.StatusCodes.OK)
				.json({ resume });
		} catch (error) {
			next(error);
		}
	});
}
exports.getByAccount = getByAccount;
