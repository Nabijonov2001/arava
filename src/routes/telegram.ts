import { Router } from "express";
import { TelegramController } from "../controllers/telegram";
import { authMiddleware } from "../middleware/auth";

const router = Router({ mergeParams: true });
const controller = new TelegramController();

router.route("/all").get(authMiddleware(["admin"]), controller.getAll);

export default router;
