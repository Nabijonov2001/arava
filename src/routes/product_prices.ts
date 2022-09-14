import { Router } from "express";
import { Product_pricesController } from "../controllers/product_prices";
import { Product_pricesValidator } from "../validators/product_prices";
import { authMiddleware } from "../middleware/auth";

const router = Router({ mergeParams: true });
const controller = new Product_pricesController();
const validator = new Product_pricesValidator();

router.route("/all").get(authMiddleware(["admin", "agent"]), controller.getAll);
router.route("/create").post(authMiddleware(["agent"]), validator.create, controller.create);

router
	.route("/:id")
	.get(authMiddleware(["admin", "agent"]), controller.getOne)
	.patch(authMiddleware(["agent"]), validator.update, controller.update)
	.delete(authMiddleware(["agent"]), controller.delete);

export default router;
