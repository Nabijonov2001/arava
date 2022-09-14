import Joi from "joi";
import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";

export class UnitValidator {
	keys = {
		required: "required",
		optional: "optional"
	};

	createSchema = Joi.object({
		category_ids: Joi.array().items(Joi.string()).required(),
		name: Joi.string().required(),
		short_name: Joi.string().required()
	});

	updateSchema = Joi.object({
		category_ids: Joi.array().items(Joi.string()).required(),
		name: Joi.string(),
		short_name: Joi.string()
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
