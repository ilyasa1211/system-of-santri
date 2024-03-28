import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { Express, Router } from "express";
import helmet from "helmet";
import logger from "./middlewares/morgan";
import path from "path";
import schedule from "node-schedule";
import Token from "./helpers/token";
import passport from "passport";
import { StrategyJWT } from "./configs/passport";
import Role from "./models/role.model";
import Configuration from "./models/configuration.model";
import errorHandler from "./middlewares/error-handler";
import urlNotFound from "./middlewares/url-not-found";
import V1Route from "./routes/api";

dotenv.config();
passport.use(new StrategyJWT().getStrategy());

const onlineSince: string = new Date().toString();

// Define the cron expression for January 1st at 00:00
const everyYear: string = "0 0 0 1 1 *";

// Define the cron expression for everyDay at 00:00
const everyDay: string = "0 0 0 * * *";

schedule
    .scheduleJob(everyYear, async () => {
        await refreshCalendar(Calendar, findOrCreate);
        console.info("Calendar Refreshed!");
    })
    .invoke();

schedule.scheduleJob(everyDay, async () => {
    const today: number = new Date().getTime();
    const deleted = await Account.deleteMany({
        verifyExpiration: { $lt: today },
        verify: false,
    });
    await Configuration.updateOne(
        { key: "absence_token" },
        { value: Token.generateRandomToken(3) },
        { upsert: true },
    );
    console.info("Deleted unverfied account! count: ", deleted.deletedCount);
});

await Role.initialize();
await Configuration.findOrCreate({ key: "access_code" });
await Configuration.findOrCreate({ key: "absence_token" });

const app: Express = express();
const router: Router = express.Router();

app.use(cors());
app.use(helmet());
app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const v1 = new V1Route(router);

app.use("/api/v1", v1.getRouter());

app.use(urlNotFound);
app.use(errorHandler);

export default app;
