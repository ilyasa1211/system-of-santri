import { Router } from "express";
import passport from "passport";
import * as NoteController from "../../../controllers/note";
import { accountIs } from "../../../middlewares";
import { ROLES } from "../../../traits/role";

const router: Router = Router();

router.use(passport.authenticate("jwt", { session: false }));

router.get("/", NoteController.index);
router.get("/:id", NoteController.show);

router.use(accountIs(ROLES.ADMIN, ROLES.MANAGER));

router.post("/", NoteController.insert);
router.delete("/:id", NoteController.destroy);
router.put("/:id", NoteController.update);

export default router;
