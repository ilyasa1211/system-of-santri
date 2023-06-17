require("dotenv").config();
require("./config/db");
require("./config/passport");

import express from "express";
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

// Define the cron expression for January 1st at 00:00
const everyYear = "0 0 0 1 1 *";

// Define the cron expression for everyDay at 00:00
const everyDay = "0 0 0 * * *";
// Schedule the task to run on the defined cron expression
const job = schedule.scheduleJob(everyYear, async () => {
  await refreshCalendar(Calendar, findOrCreate);
  console.log("Calendar Refreshed!");
});
const job2 = schedule.scheduleJob(everyDay, async () => {
  const today = new Date().getTime();
  const deleted = await Account.deleteMany({
    verifyExpiration: { $lt: today },
    verify: false,
  });
  const absenseToken = await Configuration.updateOne(
    { key: "absense_token" },
    { value: generateToken(3) },
    { upsert: true },
  );
  console.log("Deleted unverfied account! count: ", deleted.deletedCount);
});
job.invoke();

(async function () {
  await findOrCreate<IConfiguration>(Configuration, { key: "access_code" });
  await refreshRole(Role, findOrCreate);
  console.log("Refreshed Access Code!");
  console.log("Refreshed Role!");
})();

const app = express();

app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", landingRoute);
app.use("/api/v1", v1);

app.use(notFound);
app.use(error);

export = app;
