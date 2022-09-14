import { Router } from "express";
import { PricesController } from "../controllers/prices";
import { PricesValidator } from "../validators/prices";
import { authMiddleware } from "../middleware/auth";

const router = Router({ mergeParams: true });
const controller = new PricesController();
const validator = new PricesValidator();

router.route("/all").get(authMiddleware(["all"]), controller.getAll);
router.route("/create").post(authMiddleware(["admin"]), validator.create, controller.create);

router
	.route("/:id")
	.get(authMiddleware(["all"]), controller.getOne)
	.patch(authMiddleware(["admin"]), validator.update, controller.update)
	.delete(authMiddleware(["admin"]), controller.delete);

export default router;
