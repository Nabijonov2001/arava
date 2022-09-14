import Joi from "joi";
import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";

export class BannerValidator {
	keys = {
		required: "required",
		optional: "optional"
	};

	createSchema = Joi.object({
		above: Joi.boolean(),
		below: Joi.boolean(),
		description: Joi.string().required(),
		expiration_date: Joi.number().required(),
		status: Joi.string().valid("visible", "hidden")
	});

	updateSchema = Joi.object({
		above: Joi.boolean(),
		below: Joi.boolean(),
		title: Joi.string(),
		description: Joi.string(),
		expiration_date: Joi.number(),
		status: Joi.string().valid("visible", "hidden")
	});

	create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { error } = this.createSchema.validate(req.body);
		if (error) return next(error);

		next();
	});

	update = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { error } = this.updateSchema.validate(req.body);
		if (error) return next(error);

		next();
	});
}
