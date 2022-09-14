import { NextFunction, Request, Response } from "express";
import { storage } from "../storage/main";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";

export class Phone_viewController {
	getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { role, user: admin } = res.locals;

		if (role === "admin")
			if (admin.status !== "super_admin")
				if (!admin.role?.phone_view?.get)
					return next(new AppError(401, "Sizni bunday vakolatingiz yoq!"));

		const phone_views = await storage.phone_view.find(req.query);

		res.status(200).json({
			success: true,
			data: {
				phone_views
			}
		});
	});

	getOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { role, user: admin } = res.locals;

		if (role === "admin")
			if (admin.status !== "super_admin")
				if (!admin.role?.phone_view?.get)
					return next(new AppError(401, "Sizni bunday vakolatingiz yoq!"));

		const phone_view = await storage.phone_view.findOne({ _id: req.params.id });

		res.status(200).json({
			success: true,
			data: {
				phone_view
			}
		});
	});

	create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { product_id } = req.body,
			category_id = (
				await storage.product.update({ _id: product_id }, { $inc: { phone_views: 1 } })
			).category_id;

		const phone_view = await storage.phone_view.create({
			...req.body,
			category_id,
			client_id: res.locals.id
		});

		res.status(201).json({
			success: true,
			data: {
				phone_view
			}
		});

		next();
	});
}
