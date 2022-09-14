import { NextFunction, Request, Response } from "express";
import { logger } from "../config/logger";
import { storage } from "../storage/main";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";

export class PricesController {
	getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { role, user: admin } = res.locals;

		if (role === "admin")
			if (admin.status !== "super_admin")
				if (!admin.role?.prices?.get)
					return next(new AppError(401, "Sizni bunday vakolatingiz yoq!"));

		const pricess = await storage.prices.find(req.query);

		res.status(200).json({
			success: true,
			data: {
				pricess
			}
		});
	});

	getOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { role, user: admin } = res.locals;

		if (role === "admin")
			if (admin.status !== "super_admin")
				if (!admin.role?.prices?.get)
					return next(new AppError(401, "Sizni bunday vakolatingiz yoq!"));

		const prices = await storage.prices.findOne({ _id: req.params.id });

		res.status(200).json({
			success: true,
			data: {
				prices
			}
		});
	});

	create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { role, user: admin } = res.locals;

		if (role === "admin")
			if (admin.status !== "super_admin")
				if (!admin.role?.prices?.create)
					return next(new AppError(401, "Sizni bunday vakolatingiz yoq!"));

		const prices = await storage.prices.create(req.body);

		res.status(201).json({
			success: true,
			data: {
				prices
			}
		});
	});

	update = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { role, user: admin } = res.locals;

		if (role === "admin")
			if (admin.status !== "super_admin")
				if (!admin.role?.prices?.update)
					return next(new AppError(401, "Sizni bunday vakolatingiz yoq!"));

		const _prices = await storage.prices.find({ category_id: req.params.id }),
			ids = [],
			prices = [];
		for (const price of req.body) {
			if (price._id) {
				prices.push(await storage.prices.update({ _id: price._id }, price));
				ids.push(price._id);
			} else prices.push(await storage.prices.create(price));
		}

		for (const price of _prices)
			if (!ids.includes(price._id)) await storage.prices.delete({ _id: price._id });

		res.status(200).json({
			success: true,
			data: {
				prices
			}
		});
	});

	delete = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { role, user: admin } = res.locals;

		if (role === "admin")
			if (admin.status !== "super_admin")
				if (!admin.role?.prices?.delete)
					return next(new AppError(401, "Sizni bunday vakolatingiz yoq!"));

		await storage.prices.delete({ _id: req.params.id });

		const pricess = await storage.prices.find(req.query);

		res.status(200).json({
			success: true,
			data: {
				pricess
			}
		});
	});
}
