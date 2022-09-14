import Joi from "joi";
import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";

export class Dynamic_modelValidator {
	keys = {
		required: "required",
		optional: "optional"
	};

	createSchema = Joi.array().items(
		Joi.object({
			category_id: Joi.string().required(),
			required: Joi.boolean(),
			type: Joi.string().valid("text", "selection", "numeric").required(),
			name: Joi.string().required(),
			values: Joi.array().items(Joi.string().required()).when("type", {
				is: "selection",
				then: Joi.required(),
				otherwise: Joi.forbidden()
			})
		})
	);

	updateSchema = Joi.array().items(
		Joi.object({
			_id: Joi.string(),
			category_id: Joi.string(),
			required: Joi.boolean(),
			type: Joi.string().valid("text", "selection", "numeric").required(),
			name: Joi.string().required(),
			values: Joi.array().items(Joi.string().required()).when("type", {
				is: "selection",
				then: Joi.required(),
				otherwise: Joi.forbidden()
			})
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
