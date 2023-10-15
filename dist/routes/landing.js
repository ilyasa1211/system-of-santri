import { Router } from "express";
import { StatusCodes } from "http-status-codes";
const router = Router();
export default router;
router.get("/", (request, response) => {
    const { onlineSince } = request;
    return response.status(StatusCodes.OK).json({
        message: "Welcome to System of Santri!",
        onlineSince,
    });
});
