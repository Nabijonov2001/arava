import { Router } from "express";
import upload from "../middleware/multer";
import { BannerController } from "../controllers/banner";
import { BannerValidator } from "../validators/banner";
import { authMiddleware } from "../middleware/auth";
import { clear, get, set } from "../middleware/cache";

const router = Router({ mergeParams: true });
const controller = new BannerController();
const validator = new BannerValidator();

router.route("/all").get(authMiddleware(["all"]), get(), controller.getAll, set());
router
	.route("/create")
	.post(
		authMiddleware(["admin"]),
		upload(["image/jpeg", "image/png"], 10).single("image"),
		validator.create,
		controller.create,
		clear()
	);

router
	.route("/:id")
	.get(authMiddleware(["all"]), controller.getOne)
	.patch(
		authMiddleware(["admin"]),
		upload(["image/jpeg", "image/png"], 10).single("image"),
		validator.update,
		controller.update,
		clear()
	)
	.delete(authMiddleware(["admin"]), controller.delete, clear());

export default router;
