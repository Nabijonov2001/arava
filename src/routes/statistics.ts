import { Router } from "express";
import { StatisticsController } from "../controllers/statistics";
import { authMiddleware } from "../middleware/auth";

const router = Router({ mergeParams: true });
const controller = new StatisticsController();

router.route("/").get(authMiddleware(["admin"]), controller.getAll);
router.route("/agent").get(authMiddleware(["agent"]), controller.getAgent);
router.route("/client").get(authMiddleware(["client"]), controller.getClient);

export default router;
