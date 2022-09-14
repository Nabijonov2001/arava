import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import catchAsync from "../utils/catchAsync";

export class NotificationValidator {
	keys = {
		required: "required",
		optional: "optional"
	};

	createSchema = Joi.object({
		from_who: Joi.string().required(),
		to_who: Joi.string().required(),
		message: Joi.string().required()
	});

	create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { error } = this.createSchema.validate(req.body);

		if (error) return next(error);

		next();
	});
}
