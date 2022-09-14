import Joi from "joi";
import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";

export class ComplaintValidator {
	keys = {
		required: "required",
		optional: "optional"
	};

	createSchema = Joi.object({
		product_id: Joi.string(),
		complaint_id: Joi.string().when("product_id", {
			is: Joi.exist(),
			then: Joi.forbidden(),
			otherwise: Joi.required()
		}),
		text: Joi.string().required(),
		read: Joi.valid(true)
	});

	updateSchema = Joi.object({
		read: Joi.valid(true)
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
