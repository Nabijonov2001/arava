import { NextFunction, Request, Response } from "express";
import { storage } from "../storage/main";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";

export class Product_pricesController {
	getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { role, user: admin } = res.locals;

		if (role === "admin")
			if (admin.status !== "super_admin")
				if (!admin.role?.product_prices?.get)
					return next(new AppError(401, "Sizni bunday vakolatingiz yoq!"));

		const product_pricess = await storage.product_prices.find(req.query);

		res.status(200).json({
			success: true,
			data: {
				product_pricess
			}
		});
	});

	getOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { role, user: admin } = res.locals;

		if (role === "admin")
			if (admin.status !== "super_admin")
				if (!admin.role?.product_prices?.get)
					return next(new AppError(401, "Sizni bunday vakolatingiz yoq!"));

		const product_prices = await storage.product_prices.findOne({ _id: req.params.id });

		res.status(200).json({
			success: true,
			data: {
				product_prices
			}
		});
	});

	create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { role, user: admin } = res.locals;

		if (role === "admin")
			if (admin.status !== "super_admin")
				if (!admin.role?.product_prices?.create)
					return next(new AppError(401, "Sizni bunday vakolatingiz yoq!"));

		const product_prices = await storage.product_prices.create(req.body);

		res.status(201).json({
			success: true,
			data: {
				product_prices
			}
		});
	});

	update = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { role, user: admin } = res.locals;

		if (role === "admin")
			if (admin.status !== "super_admin")
				if (!admin.role?.product_prices?.update)
					return next(new AppError(401, "Sizni bunday vakolatingiz yoq!"));

		const product_prices = await storage.product_prices.update(
			{ _id: req.params.id },
			req.body
		);

		res.status(200).json({
			success: true,
			data: {
				product_prices
			}
		});
	});

	delete = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { role, user: admin } = res.locals;

		if (role === "admin")
			if (admin.status !== "super_admin")
				if (!admin.role?.product_prices?.delete)
					return next(new AppError(401, "Sizni bunday vakolatingiz yoq!"));

		await storage.product_prices.delete({ _id: req.params.id });

		const product_pricess = await storage.product_prices.find(req.query);

		res.status(200).json({
			success: true,
			data: {
				product_pricess
			}
		});
	});
}
