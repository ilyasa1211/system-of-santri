"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {  step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) {  step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const http_status_codes_1 = require("http-status-codes");
const utils_1 = require("../utils");
const errors_1 = require("../enums/errors");
const response_1 = require("../enums/response");
class WorkController {
    /**
     * Get all works from all account, everyone has rights
     */
    index(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            
                const works = yield models_1.Work.find().sort({ createdAt: "desc" });
                return response.status(http_status_codes_1.StatusCodes.OK).json({ works });
            }
            catch (error) {
                next(error);
            }
        });
    }
    /**
     * Show one work from id, everyone has rights
     */
    show(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            
                const { id } = request.params;
                const work = yield models_1.Work.findById(id);
                if (!work) {
                    throw new errors_1.NotFoundError(response_1.ResponseMessage.WORK_NOT_FOUND);
                }
                return response.status(http_status_codes_1.StatusCodes.OK).json({ work });
            }
            catch (error) {
                next(error);
            }
        });
    }
    /**
     * Create a new work, everyone has rights
     */
    insert(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            
                const user = request.user;
                request.body.accountId = user.id;
                const work = yield models_1.Work.create(request.body);
                const account = (yield models_1.Account.findById(user.id));
                account.workId.push(work.id);
                yield account.save();
                return response.status(http_status_codes_1.StatusCodes.OK).json({
                    message: response_1.ResponseMessage.WORK_CREATED,
                    work,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    /**
     * Update the exisiting work, the owner of the work has rights
     */
    update(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            
                const { params, body, user: account } = request;
                const { id } = params;
                const { title, link } = body;
                const work = yield models_1.Work.findById(id);
                if (!work) {
                    throw new errors_1.NotFoundError(response_1.ResponseMessage.WORK_NOT_FOUND);
                }
                const updatedWork = { title, link };
                Object.assign(work, updatedWork);
                (0, utils_1.authorize)(account, work.accountId.toString());
                yield work.save();
                return response.status(http_status_codes_1.StatusCodes.OK).json({
                    message: response_1.ResponseMessage.WORK_UPDATED,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    /**
     * Delete a work permanently, the owner of the work has rights
     */
    destroy(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            
                const { id } = request.params;
                const user = request.user;
                const work = yield models_1.Work.findById(id);
                if (!work) {
                    throw new errors_1.NotFoundError(response_1.ResponseMessage.WORK_NOT_FOUND);
                }
                (0, utils_1.authorize)(user, work.accountId.toString());
                yield work.deleteOne();
                return response.status(http_status_codes_1.StatusCodes.OK).json({
                    message: response_1.ResponseMessage.WORK_DELETED,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = WorkController;
