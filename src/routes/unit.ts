import { Router } from "express";
import { UnitController } from "../controllers/unit";
import { UnitValidator } from "../validators/unit";
import { authMiddleware } from "../middleware/auth";
import { clear, get, set } from "../middleware/cache";

const router = Router({ mergeParams: true });
const controller = new UnitController();
const validator = new UnitValidator();

router.route("/all").get(authMiddleware(["all"]), get(), controller.getAll, set());
router
	.route("/create")
	.post(authMiddleware(["admin"]), validator.create, controller.create, clear());

router
	.route("/:id")
	.get(authMiddleware(["all"]), controller.getOne)
	.patch(authMiddleware(["admin"]), validator.update, controller.update, clear())
	.delete(authMiddleware(["admin"]), controller.delete, clear());

export default router;
