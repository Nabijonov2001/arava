import { NextFunction, Request, Response } from "express";
import { storage } from "../storage/main";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";

export class FavouriteController {
	getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { role, user: admin } = res.locals;

		if (role === "admin")
			if (admin.status !== "super_admin")
				if (!admin.role?.favourite?.get)
					return next(new AppError(401, "Sizni bunday vakolatingiz yoq!"));

		const favourites = await storage.favourite.find(req.query);

		res.status(200).json({
			success: true,
			data: {
				favourites
			}
		});
	});

	getOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { role, user: admin } = res.locals;

		if (role === "admin")
			if (admin.status !== "super_admin")
				if (!admin.role?.favourite?.get)
					return next(new AppError(401, "Sizni bunday vakolatingiz yoq!"));

		const favourite = await storage.favourite.findOne({ _id: req.params.id });

		res.status(200).json({
			success: true,
			data: {
				favourite
			}
		});
	});

	create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { type, type_id } = req.body,
			{ id, role } = res.locals;

		let category_id;
		if (type === "Product")
			category_id = (
				await storage.product.update({ _id: type_id }, { $inc: { favourites: 1 } })
			).category_id;

		const favourite = await storage.favourite.create({
			...req.body,
			category_id,
			user: role === "agent" ? "Agent" : "Client",
			user_id: id,
			client_id: res.locals.id
		});

		res.status(201).json({
			success: true,
			data: {
				favourite
			}
		});

		next();
	});

	delete = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const favourite = await storage.favourite.delete({ _id: req.params.id });

		if (favourite.type === "Product")
			await storage.product.update({ _id: favourite.type_id }, { $inc: { favourites: -1 } });

		const favourites = await storage.favourite.find(req.query);

		res.status(200).json({
			success: true,
			data: {
				favourites
			}
		});

		next();
	});
}
