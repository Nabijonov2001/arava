import Joi from "joi";
import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";

export class FavouriteValidator {
	keys = {
		required: "required",
		optional: "optional"
	};

	createSchema = Joi.object({
		type: Joi.string().required(),
		type_id: Joi.string().required()
	});

	create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { error } = this.createSchema.validate(req.body);
		if (error) return next(error);

		next();
	});
}
