import { StatusCodes } from "http-status-codes";
export { index, insert, me, show };
async function index(request, response) {
    const currentYear = new Date().getFullYear();
    const accounts = (await Account.find()
        .select("name absenceId absences")
        .populate("absence", ["months", "year"])
        .exec());
    accounts === null || accounts === void 0 ? void 0 : accounts.forEach((account) => {
        account.absences.forEach((absence) => {
            const [day, month, year, status] = absence.split("/");
            if (year !== currentYear.toString())
                return;
            account.absence.months[MONTHS[Number(month) - 1]][Number(day) - 1].status = STATUSES[Number(status) - 1];
        });
    });
    return response.status(StatusCodes.OK).json({ absences: accounts });
}
/**
 * Show absence detail of my account
 */
async function me(request, response) {
    var _a;
    const { id } = request.user;
    const currentYear = new Date().getFullYear();
    const account = await Account.findById(id)
        .select("name absence absences year")
        .populate("absence", ["months", "year"], undefined, {
        year: currentYear,
    })
        .exec();
    if (!account) {
        throw new NotFoundError(ResponseMessage.ACCOUNT_NOT_FOUND);
    }
    (_a = account.absences) === null || _a === void 0 ? void 0 : _a.forEach((absence) => {
        const [day, month, year, status] = absence.split("/");
        if (year !== currentYear.toString())
            return;
        account.absence.months[MONTHS[Number(month) - 1]][Number(day) - 1].status = STATUSES[Number(status) - 1];
    });
    return response.status(StatusCodes.OK).json({ account });
}
/**
 * Show absence detail of an account
 */
async function show(request, response) {
    const { id } = request.params;
    const currentYear = new Date().getFullYear();
    const account = (await Account.findById(id)
        .select("name absence absences")
        .populate("absence", ["months"], undefined, { year: currentYear })
        .exec());
    account.absences.forEach((absence) => {
        const [day, month, year, status] = absence.split("/");
        if (year !== currentYear.toString())
            return;
        account.absence.months[MONTHS[Number(month) - 1]][Number(day) - 1].status = STATUSES[Number(status) - 1];
    });
    return response.status(StatusCodes.OK).json({ account });
}
/**
 * Check for today absence of my account
 */
async function insert(request, response) {
    const { token } = request.query;
    if (!token) {
        throw new BadRequestError(ResponseMessage.EMPTY_TOKEN);
    }
    const currentServerTime = new Intl.DateTimeFormat("id", {
        timeStyle: "short",
    }).format();
    const currentDate = new Date();
    const currentHours = currentDate.getHours();
    const lessonHours = 8;
    if (currentHours !== lessonHours) {
        throw new BadRequestError("You are referring to an absence that is officially over and closed. For additional assistance or to address any upcoming absences, kindly come back at " +
            lessonHours +
            "am." +
            "Current server time: " +
            currentServerTime);
    }
    const account = request.user;
    const status = ATTENDANCE_STATUS.ATTEND;
    const date = new Intl.DateTimeFormat("id").format();
    // day / month / year / status
    // 3/6/2023/1
    const now = date.concat("/", status.toString());
    const alreadyAbsent = account.absences.find((absence) => absence.slice(absence.lastIndexOf("/")).toString() ===
        now.slice(now.lastIndexOf("/")).toString());
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
