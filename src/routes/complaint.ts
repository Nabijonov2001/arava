import { Router } from "express";
import { ComplaintController } from "../controllers/complaint";
import { ComplaintValidator } from "../validators/complaint";
import { authMiddleware } from "../middleware/auth";

const router = Router({ mergeParams: true });
const controller = new ComplaintController();
const validator = new ComplaintValidator();

router.route("/all").get(authMiddleware(["admin"]), controller.getAll);
router
	.route("/create")
	.post(authMiddleware(["client", "admin"]), validator.create, controller.create);

router.route("/:id").get(authMiddleware(["admin"]), controller.getOne);

export default router;
