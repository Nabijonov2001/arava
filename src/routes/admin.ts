import { Router } from "express";
import upload from "../middleware/multer";
import { AdminController } from "../controllers/admin";
import { AdminValidator } from "../validators/admin";
import { authMiddleware } from "../middleware/auth";

const router = Router({ mergeParams: true });
const controller = new AdminController();
const validator = new AdminValidator();

router.route("/all").get(authMiddleware(["admin"]), controller.getAll);
router
	.route("/create")
	.post(
		authMiddleware(["admin"]),
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
	.get(authMiddleware(["admin"]), controller.getOne)
	.patch(
		authMiddleware(["admin"]),
		upload(["image/jpeg", "image/png"], 10).single("image"),
		validator.update,
		controller.update
	)
	.delete(authMiddleware(["admin"]), controller.delete);

router
	.route("/super-admin")
	.post(
		upload(["image/jpeg", "image/png"], 10).single("image"),
		validator.create,
		controller.createSuperAdmin
	);

export default router;
