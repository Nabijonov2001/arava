import { Router } from "express";
import { MarketController } from "../controllers/market";
import { MarketValidator } from "../validators/market";
import { authMiddleware } from "../middleware/auth";

const router = Router({ mergeParams: true });
const controller = new MarketController();
const validator = new MarketValidator();

router.route("/all").get(authMiddleware(["all"]), controller.getAll);
router.route("/create").post(authMiddleware(["admin"]), validator.create, controller.create);

router
	.route("/:id")
	.get(authMiddleware(["all"]), controller.getOne)
	.patch(authMiddleware(["admin"]), validator.update, controller.update)
	.delete(authMiddleware(["admin"]), controller.delete);

export default router;
