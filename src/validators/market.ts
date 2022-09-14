import Joi from "joi";
import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";

export class MarketValidator {
	keys = {
		required: "required",
		optional: "optional"
	};

	createSchema = Joi.object({
		name: Joi.string().required(),
		address_id: Joi.string().required()
	});

	updateSchema = Joi.object({
		name: Joi.string(),
		address_id: Joi.string()
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

