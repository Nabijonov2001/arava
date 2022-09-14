import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import catchAsync from "../utils/catchAsync";

export class ChatValidator {
	keys = {
		required: "required",
		optional: "optional"
	};

	createSchema = Joi.object({
		to_id: Joi.string().required(),
		to_who: Joi.string().valid("admin", "agent", "client").required(),
		type: Joi.string().valid("text", "images", "location").required(),
		content: Joi.object()
			.keys({
				text: Joi.string().when("location", {
					is: Joi.exist(),
					then: Joi.forbidden()
				}),
				location: Joi.object().keys({
					long: Joi.number().required(),
					lat: Joi.number().required()
				})
			})
			.required()
	});

	create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { error } = this.createSchema.validate(req.body);

		if (error) return next(error);

		next();
	});
}
