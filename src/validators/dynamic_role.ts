import Joi from "joi";
import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";

export class Dynamic_roleValidator {
	keys = {
		required: "required",
		optional: "optional"
	};

	createSchema = Joi.object({
		title: Joi.string().required(),
		trans: Joi.string().required(),
		children: Joi.array()
			.items(
				Joi.object()
					.keys({
						title: Joi.string().valid("get", "create", "update", "delete").required(),
						trans: Joi.string()
							.valid("Ko'ra olish", "Yaratish", "Tahrirlash", "O'chirish")
							.required(),
						value: Joi.boolean()
					})
					.required()
			)
			.required()
	});

	updateSchema = Joi.object({
		title: Joi.string(),
		trans: Joi.string(),
		children: Joi.array().items(
			Joi.object()
				.keys({
					title: Joi.string().valid("get", "create", "update", "delete").required(),
					trans: Joi.string()
						.valid("Ko'ra olish", "Yaratish", "Tahrirlash", "O'chirish")
						.required(),
					value: Joi.boolean()
				})
				.required()
		)
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
