import { NextFunction, Request, Response } from "express";
import { storage } from "../storage/main";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";

export class AddressController {
	getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { role, user: admin } = res.locals;

		if (role === "admin")
			if (admin.status !== "super_admin")
				if (!admin.role?.address?.get)
					return next(new AppError(401, "Sizni bunday vakolatingiz yoq!"));

		const addresses = await storage.address.find(req.query);

		res.status(200).json({
			success: true,
			data: {
				addresses
			}
		});
	});

	getOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { role, user: admin } = res.locals;

		if (role === "admin")
			if (admin.status !== "super_admin")
				if (!admin.role?.address?.get)
					return next(new AppError(401, "Sizni bunday vakolatingiz yoq!"));

		const address = await storage.address.findOne({ _id: req.params.id });

		res.status(200).json({
			success: true,
			data: {
				address
			}
		});
	});

	create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { user: admin } = res.locals;

		if (admin.status !== "super_admin")
			if (!admin.role?.address?.create)
				return next(new AppError(401, "Sizni bunday vakolatingiz yoq!"));

		const address = await storage.address.create(req.body);

		res.status(201).json({
			success: true,
			data: {
				address
			}
		});
	});

	update = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { user: admin } = res.locals;

		if (admin.status !== "super_admin")
			if (!admin.role?.address?.update)
				return next(new AppError(401, "Sizni bunday vakolatingiz yoq!"));

		const address = await storage.address.update({ _id: req.params.id }, req.body);

		res.status(200).json({
			success: true,
			data: {
				address
			}
		});
	});

	delete = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { user: admin } = res.locals,
			_id = req.params.id;
		if (admin.status !== "super_admin")
			if (!admin.role?.address?.delete)
				return next(new AppError(401, "Sizni bunday vakolatingiz yoq!"));

		const agent = (await storage.agent.find({ address_id: _id }))[0],
			demand = (await storage.demand.find({ address: _id }))[0];

		if (agent || demand)
			throw new AppError(400, "Manzil sotuvchi yoki talabga biriktirilga o'chira olmaysiz!");

		await storage.address.delete({ _id });

		res.status(200).json({
			success: true
		});
	});
}
