import Joi from "joi";
import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";

export class OtpValidator {
	keys = {
		required: "required",
		optional: "optional"
	};

	otpAuthSchema = Joi.object({
		phone_number: Joi.number().integer().required(),
		code: Joi.number(),
		status: Joi.string().valid("forget_password", "registration", "change_phone").required(),
		type: Joi.string().valid("client", "agent", "admin").required()
	});

	otpAuth = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { error } = this.otpAuthSchema.validate(req.body);
		if (error) return next(error);

		next();
	});
}
