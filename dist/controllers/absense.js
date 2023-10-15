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
exports.show = exports.me = exports.insert = exports.index = void 0;
const http_status_codes_1 = require("http-status-codes");
const errors_1 = require("../enums/errors");
const attendance_status_1 = require("../enums/attendance-status");
const enums_1 = require("../enums");
const account_1 = require("../models/account");
const response_1 = require("../enums/response");
function index(request, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        
            const currentYear = new Date().getFullYear();
            const accounts = (yield account_1.Account.find()
                .select("name absenceId absences")
                .populate("absence", ["months", "year"])
                .exec());
            accounts === null || accounts === void 0 ? void 0 : accounts.forEach((account) => {
                account.absences.forEach((absence) => {
                    const [day, month, year, status] = absence.split("/");
                    if (year !== currentYear.toString())
                        return;
                    account.absence.months[enums_1.MONTHS[Number(month) - 1]][Number(day) - 1].status = enums_1.STATUSES[Number(status) - 1];
                });
            });
            return response.status(http_status_codes_1.StatusCodes.OK).json({ absences: accounts });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.index = index;
/**
 * Show absence detail of my account
 */
function me(request, response, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        
            const { id } = request.user;
            const currentYear = new Date().getFullYear();
            const account = yield account_1.Account.findById(id)
                .select("name absence absences year")
                .populate("absence", ["months", "year"], undefined, { year: currentYear })
                .exec();
            if (!account) {
                throw new errors_1.NotFoundError(response_1.ResponseMessage.ACCOUNT_NOT_FOUND);
            }
            (_a = account.absences) === null || _a === void 0 ? void 0 : _a.forEach((absence) => {
                const [day, month, year, status] = absence.split("/");
                if (year !== currentYear.toString())
                    return;
                account.absence.months[enums_1.MONTHS[Number(month) - 1]][Number(day) - 1].status = enums_1.STATUSES[Number(status) - 1];
            });
            return response.status(http_status_codes_1.StatusCodes.OK).json({ account });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.me = me;
/**
 * Show absence detail of an account
 */
function show(request, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        
            const { id } = request.params;
            const currentYear = new Date().getFullYear();
            const account = (yield account_1.Account.findById(id)
                .select("name absence absences")
                .populate("absence", ["months"], undefined, { year: currentYear })
                .exec());
            account.absences.forEach((absence) => {
                const [day, month, year, status] = absence.split("/");
                if (year !== currentYear.toString())
                    return;
                account.absence.months[enums_1.MONTHS[Number(month) - 1]][Number(day) - 1].status = enums_1.STATUSES[Number(status) - 1];
            });
            return response.status(http_status_codes_1.StatusCodes.OK).json({ account });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.show = show;
/**
 * Check for today absence of my account
 */
function insert(request, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        
            const { token } = request.query;
            if (!token) {
                throw new errors_1.BadRequestError(response_1.ResponseMessage.EMPTY_TOKEN);
            }
            const currentServerTime = new Intl.DateTimeFormat("id", {
                timeStyle: "short",
            }).format();
            const currentDate = new Date();
            const currentHours = currentDate.getHours();
            const lessonHours = 8;
            if (currentHours !== lessonHours) {
                throw new errors_1.BadRequestError("You are referring to an absence that is officially over and closed. For additional assistance or to address any upcoming absences, kindly come back at " +
                    lessonHours +
                    "am." +
                    "Current server time: " +
                    currentServerTime);
            }
            const account = request.user;
            const status = attendance_status_1.ATTENDANCE_STATUS.ATTEND;
            const date = new Intl.DateTimeFormat("id").format();
            // day / month / year / status
            // 3/6/2023/1
            const now = date.concat("/", status.toString());
            const alreadyAbsent = account.absences.find((absence) => absence.slice(absence.lastIndexOf("/")).toString() ===
                now.slice(now.lastIndexOf("/")).toString());
            if (alreadyAbsent) {
                throw new errors_1.ConflictError(ResponseMessage.ALREADY_ABSENSE);
            }
            account.absences.push(now);
            yield account.save();
            return response.status(http_status_codes_1.StatusCodes.CREATED).json({
                statusCode: http_status_codes_1.StatusCodes.CREATED,
                message: ResponseMessage.ABSENSE_SUCCEED,
            });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.insert = insert;
