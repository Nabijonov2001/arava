import { Router } from "express";
import { Dynamic_roleController } from "../controllers/dynamic_role";
import { Dynamic_roleValidator } from "../validators/dynamic_role";
import { authMiddleware } from "../middleware/auth";

const router = Router({ mergeParams: true });
const controller = new Dynamic_roleController();
const validator = new Dynamic_roleValidator();

router.route("/all").get(authMiddleware(["all"]), controller.getAll);
router.route("/create").post(authMiddleware(["admin"]), validator.create, controller.create);

router
	.route("/:id")
	.get(authMiddleware(["all"]), controller.getOne)
	.patch(authMiddleware(["admin"]), validator.update, controller.update)
	.delete(authMiddleware(["admin"]), controller.delete);

export default router;
