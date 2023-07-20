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
exports.resume =
	exports.workShow =
	exports.workIndex =
	exports.profile =
	exports.eliminate =
	exports.restore =
	exports.trash =
	exports.destroy =
	exports.update =
	exports.show =
	exports.insert =
	exports.index =
		void 0;
const http_status_codes_1 = require("http-status-codes");
const errors_1 = require("../traits/errors");
const models_1 = require("../models");
const utils_1 = require("../utils");
const response_1 = require("../traits/response");
const delete_photo_1 = require("../utils/delete-photo");
const get_population_options_from_request_query_1 = require("../utils/get-population-options-from-request-query");
const hash_password_1 = require("../utils/hash-password");
const generate_jwt_token_1 = require("../utils/generate-jwt-token");
const projection = [
	"name",
	"email",
	"phoneNumber",
	"division",
	"status",
	"avatar",
	"santriPeriod",
	"generation",
	"generationYear",
	"roleId",
	"workId",
	"absenses",
	"absenseId",
];
/**
 *  Get All Accounts, everyone has rights
 */
function index(request, response, next) {
	return __awaiter(this, void 0, void 0, function* () {
		try {
			const fieldsToPopulate = (0,
			get_population_options_from_request_query_1.getPopulationOptionsFromRequestQuery)(
				request,
			);
			const accounts = yield models_1.Account.find({
				deletedAt: null,
				verify: true,
			})
				.select(projection)
				.populate(fieldsToPopulate)
				.exec();
			return response
				.status(http_status_codes_1.StatusCodes.OK)
				.json({ accounts });
		} catch (error) {
			next(error);
		}
	});
}
exports.index = index;
/**
 * Create an account to the database, only admin has rights
 */
function insert(request, response, next) {
	return __awaiter(this, void 0, void 0, function* () {
		try {
			const { body, file } = request;
			if (file) body.avatar = file.filename;
			body.verify = true;
			body.password = (0, hash_password_1.hashPassword)(body.password);
			const account = yield models_1.Account.create(body);
			const token = (0, generate_jwt_token_1.generateJwtToken)(account);
			return response
				.status(http_status_codes_1.StatusCodes.OK)
				.json({ token });
		} catch (error) {
			next(error);
		}
	});
}
exports.insert = insert;
/**
 * Show one account, everyone has rights
 */
function show(request, response, next) {
	return __awaiter(this, void 0, void 0, function* () {
		try {
			const { id } = request.params;
			const fieldsToPopulate = (0,
			get_population_options_from_request_query_1.getPopulationOptionsFromRequestQuery)(
				request,
			);
			const account = yield models_1.Account.findOne({
				_id: id,
				deletedAt: null,
				verify: true,
			})
				.select(projection)
				.populate(fieldsToPopulate)
				.exec();
			return response
				.status(http_status_codes_1.StatusCodes.OK)
				.json({ account });
		} catch (error) {
			if (error.message.startsWith("Cast to ObjectId failed")) {
				error.message = response_1.ResponseMessage.INVALID_ACCOUNT_ID;
				error.code = http_status_codes_1.StatusCodes.BAD_REQUEST;
			}
			next(error);
		}
	});
}
exports.show = show;
/**
 * Update the existing account, the user of the account and admin has rights
 */
function update(request, response, next) {
	return __awaiter(this, void 0, void 0, function* () {
		try {
			const { body, file, user } = request;
			const { id } = request.params;
			(0, utils_1.authorize)(user, id);
			let isAvatarUpdate = false;
			if (file) {
				body.avatar = file.filename;
				isAvatarUpdate = true;
			}
			if (body.password) {
				body.password = yield (0, hash_password_1.hashPassword)(body.password);
			}
			models_1.Account.findOneAndUpdate(
				{ _id: id, deletedAt: null },
				request.body,
				{
					returnDocument: "before",
				},
				function (error, oldAccount) {
					if (error) throw error;
					if (oldAccount && isAvatarUpdate) {
						(0, delete_photo_1.deletePhoto)(oldAccount.avatar);
					}
				},
			);
			return response.status(http_status_codes_1.StatusCodes.OK).json({
				message: response_1.ResponseMessage.ACCOUNT_UPDATED,
			});
		} catch (error) {
			next(error);
		}
	});
}
exports.update = update;
/**
 * Delete one account not permanently, the user of the account and admin has rights
 */
function destroy(request, response, next) {
	return __awaiter(this, void 0, void 0, function* () {
		try {
			const { id } = request.params;
			(0, utils_1.authorize)(request.user, id);
			yield models_1.Account.findOneAndUpdate(
				{ _id: id, deletedAt: null },
				{ deletedAt: Date.now() },
			).exec();
			return response.status(http_status_codes_1.StatusCodes.ACCEPTED).json({
				message: response_1.ResponseMessage.ACCOUNT_DELETED,
			});
		} catch (error) {
			next(error);
		}
	});
}
exports.destroy = destroy;
/**
 * Show all deleted account, admin has rights
 */
function trash(request, response, next) {
	return __awaiter(this, void 0, void 0, function* () {
		try {
			const accounts = yield models_1.Account.find({
				deletedAt: { $ne: null },
			}).exec();
			return response
				.status(http_status_codes_1.StatusCodes.OK)
				.json({ accounts });
		} catch (error) {
			next(error);
		}
	});
}
exports.trash = trash;
/**
 * Restore one of the deleted account, admin has rights
 */
function restore(request, response, next) {
	return __awaiter(this, void 0, void 0, function* () {
		try {
			const { id } = request.params;
			yield models_1.Account.findByIdAndUpdate(id, { deletedAt: null }).exec();
			return response.status(http_status_codes_1.StatusCodes.OK).json({
				message: response_1.ResponseMessage.ACCOUNT_RESTORED,
			});
		} catch (error) {
			next(error);
		}
	});
}
exports.restore = restore;
/**
 * Delete one account PERMANENTLY be careful, admin has rights
 */
function eliminate(request, response, next) {
	return __awaiter(this, void 0, void 0, function* () {
		try {
			const { id } = request.params;
			models_1.Account.findByIdAndDelete(
				{ _id: id, deletedAt: { $ne: null } },
				null,
				(error, account) => {
					if (error) throw error;
					if (!account) {
						throw new errors_1.NotFoundError(
							response_1.ResponseMessage.ACCOUNT_NOT_FOUND,
						);
					}
					(0, delete_photo_1.deletePhoto)(account.avatar);
				},
			);
			return response.status(http_status_codes_1.StatusCodes.OK).json({
				message: response_1.ResponseMessage.ACCOUNT_DELETED_PERMANENT,
			});
		} catch (error) {
			next(error);
		}
	});
}
exports.eliminate = eliminate;
/**
 * Get information about my account, everyone has rights
 */
function profile(request, response, next) {
	return __awaiter(this, void 0, void 0, function* () {
		try {
			const { id } = request.user;
			const fieldsToPopulate = (0,
			get_population_options_from_request_query_1.getPopulationOptionsFromRequestQuery)(
				request,
			);
			const account = yield models_1.Account.findOne({
				_id: id,
				deletedAt: null,
			})
				.select(projection)
				.populate(fieldsToPopulate)
				.exec();
			if (!account) {
				throw new errors_1.NotFoundError(
					response_1.ResponseMessage.ACCOUNT_NOT_FOUND,
				);
			}
			return response
				.status(http_status_codes_1.StatusCodes.OK)
				.json({ account });
		} catch (error) {
			next(error);
		}
	});
}
exports.profile = profile;
/**
 * Get all works about an account, everyone has rights
 */
function workIndex(request, response, next) {
	return __awaiter(this, void 0, void 0, function* () {
		try {
			const { id } = request.params;
			const works = yield models_1.Work.find({ accountId: id }).exec();
			return response.json({ works });
		} catch (error) {
			next(error);
		}
	});
}
exports.workIndex = workIndex;
/**
 * Get a work about an account, everyone has rights
 */
function workShow(request, response, next) {
	return __awaiter(this, void 0, void 0, function* () {
		try {
			const { workId, id } = request.params;
			const works = yield models_1.Work.find({
				_id: workId,
				accountId: id,
			}).exec();
			if (!works) {
				throw new errors_1.NotFoundError(
					response_1.ResponseMessage.WORK_NOT_FOUND,
				);
			}
			return response
				.status(http_status_codes_1.StatusCodes.OK)
				.json({ works });
		} catch (error) {
			next(error);
		}
	});
}
exports.workShow = workShow;
/**
 * Get a resume of an account, everyone has rights
 */
function resume(request, response, next) {
	return __awaiter(this, void 0, void 0, function* () {
		try {
			const { id } = request.params;
			const resume = yield models_1.Resume.findOne({ accountId: id }).exec();
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
exports.resume = resume;
