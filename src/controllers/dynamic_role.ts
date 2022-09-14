import { NextFunction, Request, Response } from "express";
import { storage } from "../storage/main";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";

export class Dynamic_roleController {
	getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { role, user: admin } = res.locals;

		if (role === "admin")
			if (admin.status !== "super_admin")
				if (!admin.role?.dynamic_role?.get)
					return next(new AppError(401, "Sizni bunday vakolatingiz yoq!"));

		const roles = await storage.dynamic_role.find(req.query);

		res.status(200).json({
			success: true,
			data: {
				roles
			}
		});
	});

	getOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { role, user: admin } = res.locals;

		if (role === "admin")
			if (admin.status !== "super_admin")
				if (!admin.role?.dynamic_role?.get)
					return next(new AppError(401, "Sizni bunday vakolatingiz yoq!"));

		const _role = await storage.dynamic_role.findOne({ _id: req.params.id });

		res.status(200).json({
			success: true,
			data: {
				role: _role
			}
		});
	});

	create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { role, user: admin } = res.locals;

		if (role === "admin")
			if (admin.status !== "super_admin")
				if (!admin.role?.dynamic_role?.create)
					return next(new AppError(401, "Sizni bunday vakolatingiz yoq!"));

		const _role = await storage.dynamic_role.create(req.body);

		res.status(201).json({
			success: true,
			data: {
				role: _role
			}
		});
	});

	update = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { role, user: admin } = res.locals;

		if (role === "admin")
			if (admin.status !== "super_admin")
				if (!admin.role?.dynamic_role?.update)
					return next(new AppError(401, "Sizni bunday vakolatingiz yoq!"));

		const _role = await storage.dynamic_role.update({ _id: req.params.id }, req.body);

		res.status(200).json({
			success: true,
			data: {
				role: _role
			}
		});
	});

	delete = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { role, user: admin } = res.locals;

		if (role === "admin")
			if (admin.status !== "super_admin")
				if (!admin.role?.dynamic_role?.delete)
					return next(new AppError(401, "Sizni bunday vakolatingiz yoq!"));

		await storage.dynamic_role.delete({ _id: req.params.id });

		const roles = await storage.dynamic_role.find(req.query);

		res.status(200).json({
			success: true,
			data: {
				roles
			}
		});
	});
}
