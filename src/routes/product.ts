import { Router } from "express";
import { ProductController } from "../controllers/product";
import { ProductValidator } from "../validators/product";
import { authMiddleware } from "../middleware/auth";
import upload from "../middleware/multer";
import { clear, get, set } from "../middleware/cache";

const router = Router({ mergeParams: true });
const controller = new ProductController();
const validator = new ProductValidator();

const files = upload(["image/jpeg", "image/jpg", "image/webp", "image/png"], 10).fields([
	{ name: "images" },
	{ name: "image", maxCount: 1 }
]);

router.route("/all/").get(authMiddleware(["all"]), get(), controller.getAll, set());
router.route("/client-interests").get(authMiddleware(["client"]), controller.clientInterests);
router
	.route("/create")
	.post(authMiddleware(["agent", "admin"]), files, validator.create, controller.create, clear());

router
	.route("/:id")
	.get(authMiddleware(["all"]), controller.getOne)
	.patch(authMiddleware(["admin", "agent"]), files, validator.update, controller.update, clear());

router.route("/:id/").delete(authMiddleware(["admin", "agent"]), controller.delete, clear());

export default router;
