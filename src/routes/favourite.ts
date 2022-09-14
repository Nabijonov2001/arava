import { Router } from "express";
import { FavouriteController } from "../controllers/favourite";
import { FavouriteValidator } from "../validators/favourite";
import { authMiddleware } from "../middleware/auth";
import { clear } from "../middleware/cache";

const router = Router({ mergeParams: true });
const controller = new FavouriteController();
const validator = new FavouriteValidator();

router.route("/all").get(authMiddleware(["all"]), controller.getAll);
router
	.route("/create")
	.post(
		authMiddleware(["client", "agent"]),
		validator.create,
		controller.create,
		clear(["/v1/product"])
	);

router
	.route("/:id")
	.get(authMiddleware(["all"]), controller.getOne)
	.delete(authMiddleware(["client", "agent"]), controller.delete, clear(["/v1/product"]));

export default router;
