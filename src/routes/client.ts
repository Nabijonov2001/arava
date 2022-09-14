import { Router } from "express";
import upload from "../middleware/multer";
import { ClientController } from "../controllers/client";
import { ClientValidator } from "../validators/client";
import { authMiddleware } from "../middleware/auth";

const router = Router({ mergeParams: true });
const controller = new ClientController();
const validator = new ClientValidator();

router.route("/all/").get(authMiddleware(["admin", "agent"]), controller.getAll);
router
	.route("/create")
	.post(
		authMiddleware(["otp"]),
		upload(["image/jpeg", "image/png"], 10).single("image"),
		validator.create,
		controller.create
	);
router.route("/login").post(validator.login, controller.login);
router
	.route("/forget-password")
	.post(authMiddleware(["otp"]), validator.forgetPassword, controller.forgetPassword);

router
	.route("/change-phone-number/:id")
	.post(authMiddleware(["otp"]), controller.changePhoneNumber);

router
	.route("/:id")
	.get(authMiddleware(["all"]), controller.getOne)
	.patch(
		authMiddleware(["client"]),
		upload(["image/jpeg", "image/png"], 10).single("image"),
		validator.update,
		controller.update
	);

router.route("/:id/").delete(authMiddleware(["admin", "client"]), controller.delete);

export default router
