import { Router } from "express";
import { RatingController } from "../controllers/rating";
import { RatingValidator } from "../validators/rating";
import { authMiddleware } from "../middleware/auth";
import { clear, get, set } from "../middleware/cache";

const router = Router({ mergeParams: true });
const controller = new RatingController();
const validator = new RatingValidator();

router.route("/all").get(authMiddleware(["all"]), get(), controller.getAll, set());
router
	.route("/create")
	.post(
		authMiddleware(["client"]),
		validator.create,
		controller.create,
		clear(["/v1/agent", "/v1/rating"])
	);
router.route("/:id").get(authMiddleware(["all"]), controller.getOne);

export default router;
