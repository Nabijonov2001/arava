import { NextFunction, Request, Response } from "express";
import { storage } from "../storage/main";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";

export class Dynamic_modelController {
	getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { role, user: admin } = res.locals;

		if (role === "admin")
			if (admin.status !== "super_admin")
				if (!admin.role?.dynamic_model?.get)
					return next(new AppError(401, "Sizni bunday vakolatingiz yoq!"));

		const dynamic_models = await storage.dynamic_model.find(req.query);

		res.status(200).json({
			success: true,
			data: {
				dynamic_models
			}
		});
	});

	getOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { role, user: admin } = res.locals;

		if (role === "admin")
			if (admin.status !== "super_admin")
				if (!admin.role?.dynamic_model?.get)
					return next(new AppError(401, "Sizni bunday vakolatingiz yoq!"));

		const dynamic_model = await storage.dynamic_model.findOne({ _id: req.params.id });

		res.status(200).json({
			success: true,
			data: {
				dynamic_model
			}
		});
	});

	create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { role, user: admin } = res.locals;

		if (role === "admin")
			if (admin.status !== "super_admin")
				if (!admin.role?.dynamic_model?.create)
					return next(new AppError(401, "Sizni bunday vakolatingiz yoq!"));

		const dynamic_model = await storage.dynamic_model.create(req.body);

		res.status(201).json({
			success: true,
			data: {
				dynamic_model
			}
		});
	});

	update = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { role, user: admin } = res.locals;

		if (role === "admin")
			if (admin.status !== "super_admin")
				if (!admin.role?.dynamic_model?.update)
					return next(new AppError(401, "Sizni bunday vakolatingiz yoq!"));

		const _dynamic_models = await storage.dynamic_model.find({ category_id: req.params.id }),
			ids = [],
			dynamic_models = [];
		for (const model of req.body) {
			if (model._id) {
				dynamic_models.push(await storage.dynamic_model.update({ _id: model._id }, model));
				ids.push(model._id);
			} else dynamic_models.push(await storage.dynamic_model.create(model));
		}

		for (const model of _dynamic_models)
			if (!ids.includes(model._id)) await storage.dynamic_model.delete({ _id: model._id });

		res.status(200).json({
			success: true,
			data: {
				dynamic_models
			}
		});
	});

	delete = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { role, user: admin } = res.locals;

		if (role === "admin")
			if (admin.status !== "super_admin")
				if (!admin.role?.dynamic_model?.delete)
					return next(new AppError(401, "Sizni bunday vakolatingiz yoq!"));

		await storage.dynamic_model.delete({ _id: req.params.id });

		const dynamic_models = await storage.dynamic_model.find(req.query);

		res.status(200).json({
			success: true,
			data: {
				dynamic_models
			}
		});
	});
}
