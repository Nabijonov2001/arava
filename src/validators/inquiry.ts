import Joi from "joi";
import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";

export class InquiryValidator {
	keys = {
		required: "required",
		optional: "optional"
	};

	createSchema = Joi.object({
		to: Joi.string().required(),
		product: Joi.string().required(),
		sub_products: Joi.array()
			.items(
				Joi.object({
					sub_product: Joi.string().required(),
					quantity: Joi.number().required()
				}).required()
			)
			.required(),
		description: Joi.string()
	});

	create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { error } = this.createSchema.validate(req.body);
		if (error) return next(error);

		next();
	});
}
