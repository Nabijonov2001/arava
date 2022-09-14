import { Router } from "express";
import { OtpController } from "../controllers/otp";
import { OtpValidator } from "../validators/otp";

const router = Router({ mergeParams: true });
const controller = new OtpController();
const validator = new OtpValidator();

router.route("/").post(validator.otpAuth, controller.otpAuth);

export default router;