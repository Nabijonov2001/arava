import { v4 as uuidv4 } from "uuid";
import { Request, Response, NextFunction } from "express";
import catchAsync from "../utils/catchAsync";
import { storage } from "../storage/main";
import AppError from "../utils/appError";
import { INotification } from "../models/Notification";

export class NotificationController {
	getOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { id, role, user: admin } = res.locals;

		if (role === "admin")
			if (admin.status !== "super_admin")
				if (!admin.role?.notification?.get)
					return next(new AppError(401, "Sizni bunday vakolatingiz yoq!"));

		const _id = req.params.id,
			notification = await storage.notification.findOne({ _id });

		res.status(200).json({
			success: true,
			data: {
				notification
			}
		});
	});

	getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { id, role, user: admin } = res.locals;

		if (role === "admin")
			if (admin.status !== "super_admin")
				if (!admin.role?.notification?.get)
					return next(new AppError(401, "Sizni bunday vakolatingiz yoq!"));

		const notifications = await storage.notification.find(req.query);

		res.status(200).json({
			success: true,
			data: {
				notifications
			}
		});
	});

	create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { id, role, user: admin } = res.locals;

		if (role === "admin")
			if (admin.status !== "super_admin")
				if (!admin.role?.notification?.create)
					return next(new AppError(401, "Sizni bunday vakolatingiz yoq!"));

		const notification = await storage.notification.create({
			...req.body,
			from_id: id
		});

		res.status(201).json({
			success: true,
			data: {
				notification
			}
		});
	});
}

