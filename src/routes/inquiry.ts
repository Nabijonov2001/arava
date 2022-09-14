import { Router } from "express";
import { InquiryController } from "../controllers/inquiry";
import { InquiryValidator } from "../validators/inquiry";
import { authMiddleware } from "../middleware/auth";

const router = Router({ mergeParams: true });
const controller = new InquiryController();
const validator = new InquiryValidator();

router.route("/all").get(authMiddleware(["all"]), controller.getAll);
router.route("/create").post(authMiddleware(["client"]), validator.create, controller.create);
router.route("/count").post(authMiddleware(["all"]), controller.count);

router.route("/:id").get(authMiddleware(["all"]), controller.getOne);

export default router;
