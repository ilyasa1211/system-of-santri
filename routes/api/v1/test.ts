import { NextFunction, Request, Response, Router } from "express";
import passport from "passport";
import { findOrCreate, refreshCalendar, refreshRole } from "../../../utils";
import { Calendar, Role } from "../../../models";

const router: Router =  Router();

export default router;

router.use(passport.authenticate("jwt", { session: false }));
router.get(
  "/",
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      await refreshCalendar(Calendar, findOrCreate);
      await refreshRole(Role, findOrCreate);
      return response.json({
        message: "Testing Succeed, Calendar refreshed, Role refreshed",
      });
    } catch (error: any) {
      next(error);
    }
  },
);
