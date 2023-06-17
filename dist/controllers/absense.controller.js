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
exports.show = exports.me = exports.insert = exports.index = void 0;
const models_1 = require("../models");
const http_status_codes_1 = require("http-status-codes");
const errors_1 = require("../errors");
const attendance_status_1 = require("../traits/attendance-status");
const traits_1 = require("../traits");
function index(request, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const currentYear = new Date().getFullYear();
            const accounts = yield models_1.Account.find({}, {
                name: 1,
                absense_id: 1,
                absenses: 1,
            })
                .populate({
                path: "absense",
                foreignField: "id",
                select: "months year -_id -id",
            });
            accounts === null || accounts === void 0 ? void 0 : accounts.forEach((account) => {
                account.absenses.forEach((absense) => {
                    const [day, month, year, status] = absense.split("/");
                    if (year !== currentYear.toString())
                        return;
                    account.absense
                        .months[traits_1.MONTHS[Number(month) - 1]][Number(day) - 1]
                        .status = traits_1.STATUSES[Number(status) - 1];
                });
            });
            return response.status(http_status_codes_1.StatusCodes.OK).json({ absenses: accounts });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.index = index;
/**
 * Show absense detail of my account
 */
function me(request, response, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = request.user;
            const currentYear = new Date().getFullYear();
            const account = yield models_1.Account.findById(id, {
                name: 1,
                absense: 1,
                absenses: 1,
                year: 1,
            }).populate({
                path: "absense",
                foreignField: "id",
                select: "months year -_id -id",
            });
            (_a = account === null || account === void 0 ? void 0 : account.absenses) === null || _a === void 0 ? void 0 : _a.forEach((absense) => {
                const [day, month, year, status] = absense.split("/");
                if (year !== currentYear.toString())
                    return;
                account.absense
                    .months[traits_1.MONTHS[Number(month) - 1]][Number(day) - 1].status =
                    traits_1.STATUSES[Number(status) - 1];
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
 * Show absense detail of an account
 */
function show(request, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = request.params;
            const currentYear = new Date().getFullYear();
            const account = yield models_1.Account.findById(id, {
                name: 1,
                absense: 1,
                absenses: 1,
            }).populate({
                path: "absense",
                foreignField: "id",
                select: "months -_id -id",
            });
            account.absenses.forEach((absense) => {
                const [day, month, year, status] = absense.split("/");
                if (year !== currentYear.toString())
                    return;
                account.absense
                    .months[traits_1.MONTHS[Number(month) - 1]][Number(day) - 1]
                    .status = traits_1.STATUSES[Number(status) - 1];
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
 * Check for today absense of my account
 */
function insert(request, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { token } = request.query;
            if (!token) {
                throw new errors_1.BadRequestError("The supplied token is not valid. Make sure token field is entered correctly.");
            }
            const currentServerTime = new Intl.DateTimeFormat("id", {
                timeStyle: "short",
            }).format();
            const currentDate = new Date();
            const currentHours = currentDate.getHours();
            const lessonHours = 8;
            if (currentHours !== lessonHours) {
                throw new errors_1.BadRequestError("You are referring to an absence that is officially over and closed. For additional assistance or to address any upcoming absences, kindly come back at " +
                    lessonHours + "am." +
                    "Current server time: " + currentServerTime);
            }
            const account = request.user;
            const status = attendance_status_1.ATTENDANCE_STATUS.ATTEND;
            const date = new Intl.DateTimeFormat("id").format();
            // day / month / year / status
            // 3/6/2023/1
            const now = date.concat("/", status.toString());
            const alreadyAbsent = account.absenses.find((absense) => absense.slice(absense.lastIndexOf("/")).toString() ===
                now.slice(now.lastIndexOf("/")).toString());
            if (alreadyAbsent) {
                throw new errors_1.ConflictError("You have a unique presence that cannot be replicated or measured twice.");
            }
            account.absenses.push(now);
            yield account.save();
            return response.status(http_status_codes_1.StatusCodes.OK).json({
                message: "Thank you for your successful presence; it has had a significant impact.",
            });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.insert = insert;
