require("dotenv").config();
require("./config/db");
require("./config/passport");

const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("./middlewares/morgan");

const schedule = require("node-schedule");
const { Calendar, Account } = require("./models");
const { error, notFound } = require("./middlewares");
const { v1, landingRoute } = require("./routes");
const { refreshCalendar, findOrCreate } = require("./utils");

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
  console.log("Deleted unverfied account! count: ", deleted.deletedCount);
});
job.invoke();

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

module.exports = app;
