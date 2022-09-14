import { Router } from "express";
import { SampleController } from "../controllers/sample";
import { SampleValidator } from "../validators/sample";

const router = Router({ mergeParams: true });
const controller = new SampleController();
const validator = new SampleValidator();

router.route("/all").get(controller.getAll);
router.route("/create").post(validator.create, controller.create);
router
	.route("/:id")
	.get(controller.getOne)
	.patch(validator.update, controller.update)
	.delete(controller.delete);

export default router;
