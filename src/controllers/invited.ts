import { NextFunction, Request, Response } from "express";
import { storage } from "../storage/main";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";

export class InvitedController {
	getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { role, user: admin } = res.locals;

		if (role === "admin")
			if (admin.status !== "super_admin")
				if (!admin.role?.invited?.get)
					return next(new AppError(401, "Sizni bunday vakolatingiz yoq!"));

		const page = req.query.page;
		delete req.query.page;

		const invited = await storage.invited.find(req.query, page ? Number(page) - 1 : 0),
			pages = await storage.invited.pageNumber(req.query);

		res.status(200).json({
			success: true,
			data: {
				invited,
				pages: Math.ceil(pages / 20)
			}
		});
	});

	getOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { role, user: admin } = res.locals;

		if (role === "admin")
			if (admin.status !== "super_admin")
				if (!admin.role?.invited?.get)
					return next(new AppError(401, "Sizni bunday vakolatingiz yoq!"));

		const invited = await storage.invited.findOne({ _id: req.params.id });

		res.status(200).json({
			success: true,
			data: {
				invited
			}
		});
	});
}
