import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import { HydratedDocument, Model } from "mongoose";
import { IAccount, IUser } from "../models/account.model";
import ApiResponse from "../utils/api-response";

export default class AbsenseController {
  public constructor(
    public account: Model<IUser>,
    public apiResponse: ApiResponse,
  ) {}
  public async index(request: Request, response: Response) {
    const currentYear: number = new Date().getFullYear();
    const accounts = (await this.account
      .find()
      .select(["name", "absenceId", "absences"])
      .populate("absence", ["months", "year"])
      .exec()) as HydratedDocument<IAccount>[];

    accounts?.forEach((account: HydratedDocument<IAccount>) => {
      account.absences.forEach((absence: string) => {
        const [day, month, year, status] = absence.split("/");
        if (year !== currentYear.toString()) return;
        account.absence.months[MONTHS[Number(month) - 1]][
          Number(day) - 1
        ].status = STATUSES[Number(status) - 1];
      });
    });
    return response.status(StatusCodes.OK).json({ absences: accounts });
  }

  /**
   * Show absence detail of an account
   */
  async show(request: Request, response: Response) {
    const { id } = request.params;
    const currentYear: number = new Date().getFullYear();
    const account: IAccount = (await Account.findById(id)

      .select("name absence absences")
      .populate("absence", ["months"], undefined, { year: currentYear })
      .exec()) as IAccount;

    account.absences.forEach((absence: string) => {
      const [day, month, year, status] = absence.split("/");
      if (year !== currentYear.toString()) return;
      account.absence.months[MONTHS[Number(month) - 1]][
        Number(day) - 1
      ].status = STATUSES[Number(status) - 1];
    });

    return response.status(StatusCodes.OK).json({ account });
  }

  /**
   * Check for today absence of my account
   */
  async insert(request: Request, response: Response) {
    const { token } = request.query;
    if (!token) {
      throw new BadRequestError(ResponseMessage.EMPTY_TOKEN);
    }

    const currentServerTime: string = new Intl.DateTimeFormat("id", {
      timeStyle: "short",
    }).format();
    const currentDate: Date = new Date();
    const currentHours: number = currentDate.getHours();
    const lessonHours: number = 8;
    if (currentHours !== lessonHours) {
      throw new BadRequestError(
        "You are referring to an absence that is officially over and closed. For additional assistance or to address any upcoming absences, kindly come back at " +
          lessonHours +
          "am." +
          "Current server time: " +
          currentServerTime,
      );
    }
    const account: IAccount = request.user as IAccount;
    const status: number = ATTENDANCE_STATUS.ATTEND;
    const date: string = new Intl.DateTimeFormat("id").format();

    // day / month / year / status
    // 3/6/2023/1
    const now: string = date.concat("/", status.toString());

    const alreadyAbsent = account.absences.find(
      (absence: string) =>
        absence.slice(absence.lastIndexOf("/")).toString() ===
        now.slice(now.lastIndexOf("/")).toString(),
    );
    if (alreadyAbsent) {
      throw new ConflictError(ResponseMessage.ALREADY_ABSENSE);
    }
    account.absences.push(now);
    await account.save();

    return response.status(StatusCodes.CREATED).json({
      statusCode: StatusCodes.CREATED,
      message: ResponseMessage.ABSENSE_SUCCEED,
    });
  }
}
