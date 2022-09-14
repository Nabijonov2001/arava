import Joi from "joi";
import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";

export class DemandValidator {
	keys = {
		required: "required",
		optional: "optional"
	};

	createSchema = Joi.object({
		address: Joi.string().required(),
		product_name: Joi.string().required(),
		category_id: Joi.string().required(),
		quantity: Joi.number().required(),
		unit: Joi.string().required(),
		price: Joi.number(),
		expire_at: Joi.string().required(),
		description: Joi.string()
	});

	updateSchema = Joi.object({
		address: Joi.string(),
		product_name: Joi.string(),
		quantity: Joi.number(),
		price: Joi.number(),
		is_negotiable: Joi.boolean(),
		expire_at: Joi.string(),
		description: Joi.string(),
		images: Joi.array().items(Joi.string().allow("")),
		status: Joi.string().valid("active", "blocked", "inactive")
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
