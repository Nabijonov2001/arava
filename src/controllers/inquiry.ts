import { NextFunction, Request, Response } from "express";
import { storage } from "../storage/main";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
import { IProduct } from "../models/Product";

export class InquiryController {
	getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { role, user: admin } = res.locals;

		if (role === "admin")
			if (admin.status !== "super_admin")
				if (!admin.role?.inquiry?.get)
					return next(new AppError(401, "Sizni bunday vakolatingiz yoq!"));

		const inquiries = await storage.inquiry.find(req.query),
			count = await storage.inquiry.count({ read: false });

		res.status(200).json({
			success: true,
			data: {
				inquiries,
				count
			}
		});
	});

	getOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { role, user: admin } = res.locals;

		if (role === "admin")
			if (admin.status !== "super_admin")
				if (!admin.role?.inquiry?.get)
					return next(new AppError(401, "Sizni bunday vakolatingiz yoq!"));

		const inquiry = await storage.inquiry.findOne({ _id: req.params.id }),
			product = inquiry.product as IProduct,
			models = await storage.dynamic_model.find({ category_id: product?.category_id }),
			prices = await storage.product_prices.find({ product_id: product?._id });

		if (!inquiry.read && role === "agent") {
			inquiry.read = true;
			await inquiry.save();
		}

		res.status(200).json({
			success: true,
			data: {
				inquiry,
				models,
				prices
			}
		});
	});

	create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { id } = res.locals;

		const inquiry = await storage.inquiry.create({
			...req.body,
			from: id
		});

		res.status(201).json({
			success: true,
			data: {
				inquiry
			}
		});
	});

	count = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const inquiry = await storage.inquiry.count(req.query);

		res.status(201).json({
			success: true,
			data: {
				inquiry
			}
		});
	});
}
