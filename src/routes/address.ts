import { Router } from "express";
import { AddressController } from "../controllers/address";
import { AddressValidator } from "../validators/address";
import { authMiddleware } from "../middleware/auth";

const router = Router({ mergeParams: true });
const controller = new AddressController();
const validator = new AddressValidator();

router.route("/all").get(authMiddleware(["all"]), controller.getAll);
router.route("/create").post(authMiddleware(["admin"]), validator.create, controller.create);

router
	.route("/:id")
	.get(authMiddleware(["all"]), controller.getOne)
	.patch(authMiddleware(["admin"]), validator.update, controller.update)
	.delete(authMiddleware(["admin"]), controller.delete);

export default router;
