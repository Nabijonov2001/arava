import { Router } from "express";
import { ShopController } from "../controllers/shop";
import { ShopValidator } from "../validators/shop";
import { authMiddleware } from "../middleware/auth";
import upload from "../middleware/multer";

const router = Router({ mergeParams: true });
const controller = new ShopController();
const validator = new ShopValidator();

router.route("/all").get(authMiddleware(["all"]), controller.getAll);
router
	.route("/create")
	.post(
		authMiddleware(["agent", "shop"]),
		upload(["image/jpeg", "image/png"], 10).single("image"),
		validator.create,
		controller.create
	);
router
	.route("/:id")
	.get(authMiddleware(["all"]), controller.getOne)
	.patch(
		authMiddleware(["agent"]),
		upload(["image/jpeg", "image/png"], 10).single("image"),
		validator.update,
		controller.update
	)
	.delete(authMiddleware(["agent", "admin"]), controller.delete);

export default router;
