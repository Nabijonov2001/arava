import { Router } from "express";
import { Phone_viewController } from "../controllers/phone_view";
import { Phone_viewValidator } from "../validators/phone_view";
import { authMiddleware } from "../middleware/auth";
import { clear } from "../middleware/cache";

const router = Router({ mergeParams: true });
const controller = new Phone_viewController();
const validator = new Phone_viewValidator();

router.route("/all").get(authMiddleware(["client", "admin"]), controller.getAll);
router
	.route("/create")
	.post(authMiddleware(["client"]), validator.create, controller.create, clear(["/v1/product"]));

router.route("/:id").get(authMiddleware(["admin", "client"]), controller.getOne);

export default router;
