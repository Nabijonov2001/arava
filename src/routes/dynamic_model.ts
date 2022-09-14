import { Router } from "express";
import { Dynamic_modelController } from "../controllers/dynamic_model";
import { Dynamic_modelValidator } from "../validators/dynamic_model";
import { authMiddleware } from "../middleware/auth";

const router = Router({ mergeParams: true });
const controller = new Dynamic_modelController();
const validator = new Dynamic_modelValidator();

router.route("/all").get(authMiddleware(["all"]), controller.getAll);
router.route("/create").post(authMiddleware(["admin"]), validator.create, controller.create);

router
	.route("/:id")
	.get(authMiddleware(["all"]), controller.getOne)
	.patch(authMiddleware(["admin"]), validator.update, controller.update)
	.delete(authMiddleware(["admin"]), controller.delete);

export default router;