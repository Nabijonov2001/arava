import { NextFunction, Request, Response } from "express";
import { storage } from "../storage/main";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";

export class CommentController {
	getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { role, user: admin } = res.locals;

		if (role === "admin")
			if (admin.status !== "super_admin")
				if (!admin.role?.comment?.get)
					return next(new AppError(401, "Sizni bunday vakolatingiz yoq!"));

		const comments = await storage.comment.find(req.query);

		res.status(200).json({
			success: true,
			data: {
				comments
			}
		});
	});

	getOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { role, user: admin } = res.locals;

		if (role === "admin")
			if (admin.status !== "super_admin")
				if (!admin.role?.comment?.get)
					return next(new AppError(401, "Sizni bunday vakolatingiz yoq!"));

		const comment = await storage.comment.findOne({ _id: req.params.id });

		res.status(200).json({
			success: true,
			data: {
				comment
			}
		});
	});

	create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { id, role, user: admin } = res.locals;

		if (role === "admin")
			if (admin.status !== "super_admin")
				if (!admin.role?.comment?.create)
					return next(new AppError(401, "Sizni bunday vakolatingiz yoq!"));

		const comment = await storage.comment.create({ ...req.body, from_id: id, from_who: role });

		res.status(201).json({
			success: true,
			data: {
				comment
			}
		});
	});
}
