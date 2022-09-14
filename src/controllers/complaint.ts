import { NextFunction, Request, Response } from "express";
import { storage } from "../storage/main";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
import { IComplaint } from "../models/Complaint";

export class ComplaintController {
	getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { role, user: admin } = res.locals;

		if (role === "admin")
			if (admin.status !== "super_admin")
				if (!admin.role?.complaint?.get)
					return next(new AppError(401, "Sizni bunday vakolatingiz yoq!"));

		const complaints = await storage.complaint.find(req.query);

		res.status(200).json({
			success: true,
			data: {
				complaints
			}
		});
	});

	getOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { role, user: admin } = res.locals;

		if (role === "admin")
			if (admin.status !== "super_admin")
				if (!admin.role?.complaint?.get)
					return next(new AppError(401, "Sizni bunday vakolatingiz yoq!"));

		const complaint = await storage.complaint.update({ _id: req.params.id }, {
			read: true
		} as IComplaint);

		let complaint_1;
		if (complaint.type === "incoming") {
			complaint_1 = await storage.complaint.findOne({ complaint_id: complaint._id });
		} else {
			complaint_1 = await storage.complaint.findOne({ _id: complaint.complaint_id });
		}

		res.status(200).json({
			success: true,
			data: {
				complaint,
				complaint_1
			}
		});
	});

	create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { product_id, complaint_id } = req.body,
			{ id } = res.locals;

		if (complaint_id) {
			await storage.complaint.findOne({ _id: complaint_id });

			const complaint = await storage.complaint.create({
				...req.body,
				read: true,
				admin_id: id,
				type: "outgoing"
			});

			return res.status(201).json({
				success: true,
				data: {
					complaint
				}
			});
		}

		await storage.product.findOne({ _id: product_id });

		const complaint = await storage.complaint.create({
			...req.body,
			client_id: id,
			type: "incoming"
		});

		res.status(201).json({
			success: true,
			data: {
				complaint
			}
		});
	});
}
