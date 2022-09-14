import { NextFunction, Request, Response } from "express";
import { storage } from "../storage/main";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";

export class UnitController {
	getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { id, role, user: admin } = res.locals;

		if (role === "admin")
			if (admin.status !== "super_admin")
				if (!admin.role?.unit?.get)
					return next(new AppError(401, "Sizni bunday vakolatingiz yoq!"));

		const units = await storage.unit.find(req.query);

		res.locals.data = {
			success: true,
			data: {
				units
			}
		};

		res.status(200).json({
			success: true,
			data: {
				units
			}
		});

		next();
	});

	getOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { role, user: admin } = res.locals;

		if (role === "admin")
			if (admin.status !== "super_admin")
				if (!admin.role?.unit?.get)
					return next(new AppError(401, "Sizni bunday vakolatingiz yoq!"));

		const unit = await storage.unit.findOne({ _id: req.params.id });

		res.status(200).json({
			success: true,
			data: {
				unit
			}
		});
	});

	create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { role, user: admin } = res.locals;

		if (role === "admin")
			if (admin.status !== "super_admin")
				if (!admin.role?.unit?.create)
					return next(new AppError(401, "Sizni bunday vakolatingiz yoq!"));

		const unit = await storage.unit.create(req.body);

		res.status(201).json({
			success: true,
			data: {
				unit
			}
		});

		next();
	});

	update = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { role, user: admin } = res.locals;

		if (role === "admin")
			if (admin.status !== "super_admin")
				if (!admin.role?.unit?.update)
					return next(new AppError(401, "Sizni bunday vakolatingiz yoq!"));

		const unit = await storage.unit.update({ _id: req.params.id }, req.body);

		res.status(200).json({
			success: true,
			data: {
				unit
			}
		});

		next();
	});

	delete = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { role, user: admin } = res.locals,
			_id = req.params.id;

		if (role === "admin")
			if (admin.status !== "super_admin")
				if (!admin.role?.unit?.delete)
					return next(new AppError(401, "Sizni bunday vakolatingiz yoq!"));

		const product = (await storage.product.find({ unit: _id }))[0];

		if (product)
			throw new AppError(
				400,
				"Olchov birligiga mahsulot biriktirilgan shu boyis tekshirb qaytagan urinib koring"
			);

		await storage.unit.delete({ _id });

		const units = await storage.unit.find(req.query);

		res.status(200).json({
			success: true,
			data: {
				units
			}
		});

		next();
	});
}
