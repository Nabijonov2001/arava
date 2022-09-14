import Joi from "joi";
import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";

export class Product_pricesValidator {
	keys = {
		required: "required",
		optional: "optional"
	};

	createSchema = Joi.array().items(
		Joi.object({
			product_id: Joi.string().required(),
			is_hidden: Joi.boolean(),
			currency: Joi.string().valid("USD", "UZS").required(),
			name: Joi.string().required()
		})
	);

	updateSchema = Joi.object({
		is_hidden: Joi.boolean(),
		currency: Joi.string().valid("USD", "UZS").required(),
		name: Joi.string().required()
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
