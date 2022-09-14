import { Router } from "express";
import { CommentController } from "../controllers/comment";
import { CommentValidator } from "../validators/comment";
import { authMiddleware } from "../middleware/auth";

const router = Router({ mergeParams: true });
const controller = new CommentController();
const validator = new CommentValidator();

router.route("/all").get(authMiddleware(["all"]), controller.getAll);
router
	.route("/create")
	.post(authMiddleware(["admin", "agent", "client"]), validator.create, controller.create);

router.route("/:id").get(authMiddleware(["all"]), controller.getOne);

export default router;

