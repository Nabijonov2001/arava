import { Router } from "express";
import { ChartController } from "../controllers/chart";
import { authMiddleware } from "../middleware/auth";

const router = Router({ mergeParams: true });
const controller = new ChartController();

router.route("/all").get(authMiddleware(["admin"]), controller.getAll);

export default router;
