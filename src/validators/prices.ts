import Joi from "joi";
import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";

export class PricesValidator {
	keys = {
		required: "required",
		optional: "optional"
	};

	createSchema = Joi.array().items(
		Joi.object({
			category_id: Joi.string().required(),
			required: Joi.boolean().required(),
			name: Joi.string().required()
		})
	);

	updateSchema = Joi.array().items(
		Joi.object({
			_id: Joi.string().required(),
			category_id: Joi.string(),
			required: Joi.boolean().required(),
			name: Joi.string().required()
		})
	);
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
