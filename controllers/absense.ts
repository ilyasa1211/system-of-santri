import { StatusCodes } from "http-status-codes";
import { BadRequestError, ConflictError, NotFoundError } from "../traits/errors";
import { ATTENDANCE_STATUS } from "../traits/attendance-status";
import { MONTHS, STATUSES } from "../traits";
import { NextFunction, Request, Response } from "express";
import { ICalendar } from "../models/calendar";
import Account, { IAccount } from "../models/account";

export { index, insert, me, show };

async function index(request: Request, response: Response, next: NextFunction) {
  try {
    const currentYear: number = new Date().getFullYear();
    const accounts: Array<IAccount> = await Account.find()
      .select("name absense_id absenses")
      .populate({
        path: "absense",
        foreignField: "id",
        select: "months year -_id -id",
      }) as Array<IAccount>;

    accounts?.forEach((account: IAccount) => {
      account.absenses.forEach((absense: string) => {
        const [day, month, year, status] = absense.split("/");
        if (year !== currentYear.toString()) return;
        (<ICalendar> account.absense)
          .months[MONTHS[Number(month) - 1]][Number(day) - 1]
          .status = STATUSES[Number(status) - 1];
      });
    });
    return response.status(StatusCodes.OK).json({ absenses: accounts });
  } catch (error: any) {
    next(error);
  }
}

/**
 * Show absense detail of my account
 */
async function me(request: Request, response: Response, next: NextFunction) {
  try {
    const { id } = request.user as IAccount;
    const currentYear: number = new Date().getFullYear();
    const account = await Account.findById(id)
      .select("name absense absenses year")
      .populate({
        path: "absense",
        foreignField: "id",
        select: "months year -_id -id",
        match: { year: currentYear },
      });

    if (!account) {
      throw new NotFoundError(
        "We apologize, but the requested account was not found.",
      );
    }

    account?.absenses?.forEach((absense) => {
      const [day, month, year, status] = absense.split("/");
      if (year !== currentYear.toString()) return;
      (<ICalendar> account.absense)
        .months[MONTHS[Number(month) - 1]][Number(day) - 1].status =
          STATUSES[Number(status) - 1];
    });

    return response.status(StatusCodes.OK).json({ account });
  } catch (error: any) {
    next(error);
  }
}

/**
 * Show absense detail of an account
 */
async function show(request: Request, response: Response, next: NextFunction) {
  try {
    const { id } = request.params;
    const currentYear: number = new Date().getFullYear();

    const account: IAccount = await Account.findById(id)
      .select("name absense absenses")
      .populate({
        path: "absense",
        foreignField: "id",
        select: "months -_id -id",
        match: { year: currentYear },
      }) as IAccount;

    account.absenses.forEach((absense: string) => {
      const [day, month, year, status] = absense.split("/");
      if (year !== currentYear.toString()) return;
      (<ICalendar> account.absense)
        .months[MONTHS[Number(month) - 1]][Number(day) - 1]
        .status = STATUSES[Number(status) - 1];
    });

    return response.status(StatusCodes.OK).json({ account });
  } catch (error: any) {
    next(error);
  }
}

/**
 * Check for today absense of my account
 */
async function insert(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const currentServerTime: string = new Intl.DateTimeFormat("id", {
      timeStyle: "short",
    }).format();
    const currentDate: Date = new Date();
    const currentHours: number = currentDate.getHours();
    const lessonHours: number = 8;
    if (currentHours !== lessonHours) {
      throw new BadRequestError(
        "You are referring to an absence that is officially over and closed. For additional assistance or to address any upcoming absences, kindly come back at " +
          lessonHours + "am." +
          "Current server time: " + currentServerTime,
      );
    }
    const account: IAccount = request.user as IAccount;
    const status: number = ATTENDANCE_STATUS.ATTEND;
    const date: string = new Intl.DateTimeFormat("id").format();

    // day / month / year / status
    // 3/6/2023/1
    const now: string = date.concat("/", status.toString());

    const alreadyAbsent = account.absenses.find((absense: string) =>
      absense.slice(absense.lastIndexOf("/")).toString() ===
        now.slice(now.lastIndexOf("/")).toString()
    );
    if (alreadyAbsent) {
      throw new ConflictError(
        "You have a unique presence that cannot be replicated or measured twice.",
      );
    }
    account.absenses.push(now);
    await account.save();

    return response.status(StatusCodes.CREATED).json({
      statusCode: StatusCodes.CREATED,
      message:
        "Thank you for your successful presence; it has had a significant impact.",
    });
  } catch (error: any) {
    next(error);
  }
}
