import Joi from "joi";
import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";

export class ProductValidator {
	keys = {
		required: "required",
		optional: "optional"
	};

	createSchema = Joi.object({
		agent_id: Joi.string(),
		name: Joi.string().required(),
		category_id: Joi.string().required(),
		unit: Joi.string().required(),
		public: Joi.boolean(),
		properties: Joi.array()
			.items(
				Joi.object().keys({
					image_count: Joi.number(),
					product_count: Joi.number(),
					prices: Joi.array().items(
						Joi.object()
							.keys({
								value: Joi.number().required()
							})
							.required()
					),
					models: Joi.array().items(
						Joi.object()
							.keys({
								propertie: Joi.string().required(),
								value: Joi.string().required()
							})
							.required()
					)
				})
			)
			.required(),
		description: Joi.string(),
		prices: Joi.array()
			.items(
				Joi.object({
					is_hidden: Joi.boolean(),
					required: Joi.boolean().valid(true),
					currency: Joi.string().valid("USD", "UZS").required(),
					name: Joi.string().required()
				})
			)
			.required()
	});

	updateSchema = Joi.object({
		name: Joi.string(),
		image: Joi.string(),
		type: Joi.string().valid("buy", "sell"),
		unit: Joi.string(),
		public: Joi.boolean(),
		properties: Joi.array().items(
			Joi.object().keys({
				images: Joi.array().items(Joi.string()),
				image_count: Joi.number(),
				product_count: Joi.number(),
				prices: Joi.array().items(
					Joi.object()
						.keys({
							value: Joi.number().required()
						})
						.required()
				),
				models: Joi.array().items(
					Joi.object()
						.keys({
							propertie: Joi.string().required(),
							value: Joi.string().required()
						})
						.required()
				)
			})
		),
		description: Joi.string(),
		status: Joi.string().valid("active", "blocked"),
		prices: Joi.array().items(
			Joi.object({
				is_hidden: Joi.boolean(),
				currency: Joi.string().valid("USD", "UZS").required(),
				name: Joi.string().required()
			})
		)
	});

	create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { properties, prices } = req.body;

		if (prices) req.body.prices = JSON.parse(prices);
		if (properties) req.body.properties = JSON.parse(properties);

		const { error } = this.createSchema.validate(req.body);
		if (error) return next(error);

		next();
	});

	update = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { properties, prices } = req.body;

		if (prices) req.body.prices = JSON.parse(prices);
		if (properties) req.body.properties = JSON.parse(properties);

		const { error } = this.updateSchema.validate(req.body);
		if (error) return next(error);

		next();
	});
}
