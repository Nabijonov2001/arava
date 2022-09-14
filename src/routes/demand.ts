import { Router } from "express";
import upload from "../middleware/multer";
import { DemandController } from "../controllers/demand";
import { DemandValidator } from "../validators/demand";
import { authMiddleware } from "../middleware/auth";
import { clear, get, set } from "../middleware/cache";

const router = Router({ mergeParams: true });
const controller = new DemandController();
const validator = new DemandValidator();

router.route("/all/").get(authMiddleware(["all"]), get(), controller.getAll, set());
router
	.route("/create")
	.post(
		authMiddleware(["client"]),
		upload(["image/jpeg", "image/png"], 10).array("images", 10),
		validator.create,
		controller.create,
		clear()
	);
router
	.route("/:id")
	.get(authMiddleware(["all"]), controller.getOne)
	.patch(
		authMiddleware(["admin", "client"]),
		upload(["image/jpeg", "image/png"], 10).array("images", 10),
		validator.update,
		controller.update,
		clear()
	);

router.route("/:id/").delete(authMiddleware(["admin", "client"]), controller.delete, clear());

export default router;
