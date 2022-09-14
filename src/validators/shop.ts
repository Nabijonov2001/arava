import Joi from "joi";
import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";

export class ShopValidator {
	keys = {
		required: "required",
		optional: "optional"
	};

	createSchema = Joi.object({
		name: Joi.string().required().min(3),
		market_id: Joi.string().required(),
		description: Joi.string()
	});

	updateSchema = Joi.object({
		name: Joi.string().min(3),
		image: Joi.string().allow(""),
		description: Joi.string()
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
