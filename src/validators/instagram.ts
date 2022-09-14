import Joi from "joi";
import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";

export class InstagramValidator {
	keys = {
		required: "required",
		optional: "optional"
	};

	interationSchema = Joi.object({
		username: Joi.string().required(),
		password: Joi.string().required()
	});

	interation = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { error } = this.interationSchema.validate(req.body);
		if (error) return next(error);

		next();
	});
}