import { application, NextFunction, Request, Response } from "express";
import { storage } from "../storage/main";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";

export class MarketController {
	getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { role, user: admin } = res.locals;

		if (role === "admin")
			if (admin.status !== "super_admin")
				if (!admin.role?.market?.get)
					return next(new AppError(401, "Sizni bunday vakolatingiz yoq!"));

		const markets = await storage.market.find(req.query);

		res.status(200).json({
			success: true,
			data: {
				markets
			}
		});
	});

	getOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { role, user: admin } = res.locals;

		if (role === "admin")
			if (admin.status !== "super_admin")
				if (!admin.role?.market?.get)
					return next(new AppError(401, "Sizni bunday vakolatingiz yoq!"));

		const market = await storage.market.findOne({ _id: req.params.id });

		res.status(200).json({
			success: true,
			data: {
				market
			}
		});
	});

	create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { role, user: admin } = res.locals;

		if (role === "admin")
			if (admin.status !== "super_admin")
				if (!admin.role?.market?.create)
					return next(new AppError(401, "Sizni bunday vakolatingiz yoq!"));

		const market = await storage.market.create(req.body);

		res.status(201).json({
			success: true,
			data: {
				market
			}
		});
	});

	update = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { role, user: admin } = res.locals;

		if (role === "admin")
			if (admin.status !== "super_admin")
				if (!admin.role?.market?.update)
					return next(new AppError(401, "Sizni bunday vakolatingiz yoq!"));

		const market = await storage.market.update({ _id: req.params.id }, req.body);

		res.status(200).json({
			success: true,
			data: {
				market
			}
		});
	});

	delete = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { id, role, user: admin } = res.locals;

		if (role === "admin")
			if (admin.status !== "super_admin")
				if (!admin.role?.market?.delete)
					return next(new AppError(401, "Sizni bunday vakolatingiz yoq!"));

		await storage.market.delete({ _id: req.params.id });

		const markets = await storage.market.find(req.query);

		res.status(200).json({
			success: true,
			data: {
				markets
			}
		});
	});
}
