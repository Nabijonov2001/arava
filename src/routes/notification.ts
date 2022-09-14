import { Router } from "express";
import { NotificationController } from "../controllers/notification";
import { NotificationValidator } from "../validators/notification";
import { authMiddleware } from "../middleware/auth";

const router = Router({ mergeParams: true });
const controller = new NotificationController();
const validator = new NotificationValidator();

router.route("/all").get(authMiddleware(["all"]), controller.getAll);
router.route("/create").post(authMiddleware(["admin"]), validator.create, controller.create);

router.route("/:id").get(authMiddleware(["all"]), controller.getOne);

export default router;
