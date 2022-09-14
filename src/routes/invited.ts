import { Router } from "express";
import { InvitedController } from "../controllers/invited";
import { authMiddleware } from "../middleware/auth";

const router = Router({ mergeParams: true });
const controller = new InvitedController();

router.route("/all").get(authMiddleware(["admin", "agent"]), controller.getAll);

router.route("/:id").get(authMiddleware(["admin", "agent"]), controller.getOne);

export default router;
