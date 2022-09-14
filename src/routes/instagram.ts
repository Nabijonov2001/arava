import { Router } from "express";
import { InstagramController } from "../controllers/instagram";
import { InstagramValidator } from "../validators/instagram";
import { authMiddleware } from "../middleware/auth";

const router = Router({ mergeParams: true });
const controller = new InstagramController();
const validator = new InstagramValidator();

router.route("/get").get(authMiddleware(["agent"]), controller.get);
router
	.route("/interation")
	.post(authMiddleware(["agent"]), validator.interation, controller.interation);

export default router;