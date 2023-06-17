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
require("dotenv").config();
require("./config/db");
require("./config/passport");
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("./middlewares/morgan"));
const node_schedule_1 = __importDefault(require("node-schedule"));
const models_1 = require("./models");
const middlewares_1 = require("./middlewares");
const routes_1 = require("./routes");
const utils_1 = require("./utils");
// Define the cron expression for January 1st at 00:00
const everyYear = "0 0 0 1 1 *";
// Define the cron expression for everyDay at 00:00
const everyDay = "0 0 0 * * *";
// Schedule the task to run on the defined cron expression
const job = node_schedule_1.default.scheduleJob(everyYear, () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, utils_1.refreshCalendar)(models_1.Calendar, utils_1.findOrCreate);
    console.log("Calendar Refreshed!");
}));
const job2 = node_schedule_1.default.scheduleJob(everyDay, () => __awaiter(void 0, void 0, void 0, function* () {
    const today = new Date().getTime();
    const deleted = yield models_1.Account.deleteMany({
        verifyExpiration: { $lt: today },
        verify: false,
    });
    const absenseToken = yield models_1.Configuration.updateOne({ key: "absense_token" }, { value: (0, utils_1.generateToken)(3) }, { upsert: true });
    console.log("Deleted unverfied account! count: ", deleted.deletedCount);
}));
job.invoke();
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, utils_1.findOrCreate)(models_1.Configuration, { key: "access_code" });
        yield (0, utils_1.refreshRole)(models_1.Role, utils_1.findOrCreate);
        console.log("Refreshed Access Code!");
        console.log("Refreshed Role!");
    });
})();
const app = (0, express_1.default)();
app.use(morgan_1.default);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
app.use("/", routes_1.landingRoute);
app.use("/api/v1", routes_1.v1);
app.use(middlewares_1.notFound);
app.use(middlewares_1.error);
module.exports = app;
