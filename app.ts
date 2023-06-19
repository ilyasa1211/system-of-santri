require("dotenv").config();
require("./config/database");
require("./config/passport");

import express, { Express } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "./middlewares/morgan";

import schedule from "node-schedule";
import {
  Account,
  Calendar,
  Configuration,
  IConfiguration,
  Role,
} from "./models";
import { error, notFound } from "./middlewares";
import { landingRoute, v1 } from "./routes";
import {
  findOrCreate,
  generateToken,
  refreshCalendar,
  refreshRole,
} from "./utils";

const onlineSince: string = new Date().toString();

// Define the cron expression for January 1st at 00:00
const everyYear: string = "0 0 0 1 1 *";

// Define the cron expression for everyDay at 00:00
const everyDay: string = "0 0 0 * * *";

const job = schedule.scheduleJob(everyYear, async () => {
  await refreshCalendar(Calendar, findOrCreate);
  console.info("Calendar Refreshed!");
});

const job2 = schedule.scheduleJob(everyDay, async () => {
  const today: number = new Date().getTime();
  const deleted = await Account.deleteMany({
    verifyExpiration: { $lt: today },
    verify: false,
  });
  const absenseToken = await Configuration.updateOne(
    { key: "absense_token" },
    { value: generateToken(3) },
    { upsert: true },
  );
  console.info("Deleted unverfied account! count: ", deleted.deletedCount);
});
job.invoke();

(async function () {
  await findOrCreate<IConfiguration>(Configuration, { key: "access_code" });
  await refreshRole(Role, findOrCreate);
  console.info("Refreshed Access Code!");
  console.info("Refreshed Role!");
})();

const app: Express = express();

app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/", (req, res, next) => {
  Object.defineProperty(req, "onlineSince", { value: onlineSince });
  next();
}, landingRoute);

app.use("/api/v1", v1);

app.use(notFound);
app.use(error);

export = app;
