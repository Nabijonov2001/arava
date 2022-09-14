import { Router } from "express";
import upload from "../middleware/multer";
import { CategoryController } from "../controllers/category";
import { CategoryValidator } from "../validators/category";
import { authMiddleware } from "../middleware/auth";
import { clear, get, set } from "../middleware/cache";

const router = Router({ mergeParams: true });
const controller = new CategoryController();
const validator = new CategoryValidator();

router.route("/all").get(authMiddleware(["all"]), get(), controller.getAll, set());
router
	.route("/create")
	.post(
		authMiddleware(["admin"]),
		upload(["image/svg+xml"], 10).single("icon"),
		validator.create,
		controller.create,
		clear()
	);

router
	.route("/:id")
	.get(authMiddleware(["all"]), controller.getOne)
	.patch(
		authMiddleware(["admin"]),
		upload(["image/svg+xml"], 10).single("icon"),
		validator.update,
		controller.update,
		clear()
	)
	.delete(authMiddleware(["admin"]), controller.delete, clear());

export default router;
