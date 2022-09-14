import Joi from "joi";
import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";

export class RatingValidator {
	keys = {
		required: "required",
		optional: "optional"
	};

	createSchema = Joi.object({
		type: Joi.string().valid("Agent", "Product").required(),
		type_id: Joi.string().required(),
		stars: Joi.number().required().min(1).max(5),
		comment: Joi.string()
	});

	create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { error } = this.createSchema.validate(req.body);
		if (error) return next(error);

		next();
	});
}
