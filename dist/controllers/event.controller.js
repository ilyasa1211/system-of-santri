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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.update = exports.insert = exports.index = exports.destroy = exports.calendar = void 0;
const models_1 = require("../models");
const http_status_codes_1 = require("http-status-codes");
const errors_1 = require("../errors");
const find_or_create_1 = __importDefault(require("../utils/find-or-create"));
const month_1 = __importDefault(require("../traits/month"));
/**
 * Get event calendar
 */
function calendar(request, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const year = new Date().getFullYear();
            const calendar = yield (0, find_or_create_1.default)(models_1.Calendar, { year });
            const events = yield models_1.Event.find();
            events.forEach((event) => {
                var _a;
                const { title, slug, date } = event;
                const [month, day] = date.split("-").slice(1);
                (_a = calendar.months[month_1.default[Number(month) - 1]][Number(day) - 1].event) === null || _a === void 0 ? void 0 : _a.push({
                    title,
                    slug,
                });
            });
            return response.status(http_status_codes_1.StatusCodes.OK).json({ calendar });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.calendar = calendar;
/**
 * Get normal calendar
 */
function index(request, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const events = yield models_1.Event.find();
            return response.status(http_status_codes_1.StatusCodes.OK).json({ events });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.index = index;
/**
 * Create an event
 */
function insert(request, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield models_1.Event.create(request.body);
            return response.status(http_status_codes_1.StatusCodes.CREATED).json({
                message: "Congratulations! It was successful creating the event. ",
            });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.insert = insert;
/**
 * Update an event
 */
function update(request, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = request.params;
            const event = yield models_1.Event.findById(id);
            if (!event) {
                throw new errors_1.NotFoundError("We regret the inconvenience, but we were unable to locate the requested event. Please double-check the event details or make sure you have provided accurate information.");
            }
            Object.assign(event, request.body);
            yield event.save();
            return response.status(http_status_codes_1.StatusCodes.OK).json({
                message: "Congratulations! The most recent changes have been successfully updated for the event. The required updates have been made.",
            });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.update = update;
/**
 * Delete an event
 */
function destroy(request, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = request.params;
            yield models_1.Event.findOneAndDelete({ _id: id });
            return response.status(http_status_codes_1.StatusCodes.OK).json({
                message: "Congratulations! The most recent changes have been successfully updated for the event. The required updates have been made.",
            });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.destroy = destroy;
