import { Router } from "express";
import { ChatController } from "../controllers/chat";
import { authMiddleware } from "../middleware/auth";
import { ChatValidator } from "../validators/chat";
import upload from "../middleware/multer";

const router = Router({ mergeParams: true });
const controller = new ChatController();
const validator = new ChatValidator();

router
	.route("/create")
	.post(
		authMiddleware(["admin", "agent", "client"]),
		upload(["image/jpeg", "image/png"], 10).array("images", 10),
		validator.create,
		controller.create
	);

router
	.route("/update")
	.patch(authMiddleware(["admin", "agent", "client"]), validator.create, controller.create);

router.route("/:id").get(authMiddleware(["admin", "agent", "client"]), controller.getOne);

export default router
