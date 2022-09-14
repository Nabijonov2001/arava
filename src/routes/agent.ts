import { Router } from "express";
import upload from "../middleware/multer";
import { AgentController } from "../controllers/agent";
import { AgentValidator } from "../validators/agent";
import { authMiddleware } from "../middleware/auth";
import { clear, get, set } from "../middleware/cache";

const router = Router({ mergeParams: true });
const controller = new AgentController();
const validator = new AgentValidator();

router.route("/all/").get(authMiddleware(["all"]), get(), controller.getAll, set());

router
	.route("/create")
	.post(
		authMiddleware(["otp"]),
		upload(["image/jpeg", "image/png"], 10).single("image"),
		validator.create,
		controller.create,
		clear()
	);

router
	.route("/create-admin")
	.post(
		authMiddleware(["admin"]),
		upload(["image/jpeg", "image/png"], 10).single("image"),
		validator.createAdmin,
		controller.create,
		clear()
	);

router.route("/login").post(validator.login, controller.login);

router
	.route("/forget-password")
	.post(authMiddleware(["otp"]), validator.forgetPassword, controller.forgetPassword);

router
	.route("/change-phone-number/:id")
	.post(authMiddleware(["otp"]), controller.changePhoneNumber, clear());

router
	.route("/:id")
	.get(authMiddleware(["all"]), controller.getOne)
	.patch(
		authMiddleware(["admin", "agent"]),
		upload(["image/jpeg", "image/png"], 10).single("image"),
		validator.update,
		controller.update,
		clear()
	);

router.route("/:id/").delete(authMiddleware(["admin", "agent"]), controller.delete, clear());

export default router;
