import Joi from "joi";
import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";

export class Phone_viewValidator {
	keys = {
		required: "required",
		optional: "optional"
	};

	createSchema = Joi.object({
		product_id: Joi.string().required()
	});

	create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { error } = this.createSchema.validate(req.body);
		if (error) return next(error);

		next();
	});
}