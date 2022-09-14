import Joi from "joi";
import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";

export class CategoryValidator {
	keys = {
		required: "required",
		optional: "optional"
	};

	createSchema = Joi.object({
		name: Joi.string().required(),
		sup_category_id: Joi.string()
	});

	updateSchema = Joi.object({
		name: Joi.string(),
		visible: Joi.boolean(),
		icon: Joi.string().allow(""),
		sup_category_id: Joi.string().when("icon", {
			is: Joi.exist(),
			then: Joi.forbidden()
		})
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
