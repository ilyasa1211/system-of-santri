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
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const utils_1 = require("../../../utils");
const models_1 = require("../../../models");
const router = (0, express_1.Router)();
exports.default = router;
router.use(passport_1.default.authenticate("jwt", { session: false }));
router.get("/", (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, utils_1.refreshCalendar)(models_1.Calendar, utils_1.findOrCreate);
        yield (0, utils_1.refreshRole)(models_1.Role, utils_1.findOrCreate);
        return response.json({
            message: "Testing Succeed, Calendar refreshed, Role refreshed",
        });
    }
    catch (error) {
        next(error);
    }
}));
