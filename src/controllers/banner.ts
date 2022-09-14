import { NextFunction, Request, Response } from "express";
import { logger } from "../config/logger";
import { storage } from "../storage/main";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";
import { v4 as uuidv4 } from "uuid";
import { writeFile, unlink } from "fs/promises";
import sharp from "sharp";
import path from "path";

export class BannerController {
	getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { role, user: admin } = res.locals;

		if (role === "admin")
			if (admin.status !== "super_admin")
				if (!admin.role?.banner?.get)
					return next(new AppError(401, "Sizni bunday vakolatingiz yoq!"));

		const page = req.query.page;
		delete req.query.page;

		const banners = await storage.banner.find(req.query, page ? Number(page) - 1 : 0);

		res.locals.data = {
			success: true,
			data: {
				banners
			}
		};

		res.status(200).json({
			success: true,
			data: {
				banners
			}
		});

		next();
	});

	getOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { role, user: admin } = res.locals;

		if (role === "admin")
			if (admin.status !== "super_admin")
				if (!admin.role?.banner?.get)
					return next(new AppError(401, "Sizni bunday vakolatingiz yoq!"));

		const banner = await storage.banner.findOne({ _id: req.params.id });

		res.status(200).json({
			success: true,
			data: {
				banner
			}
		});
	});

	create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { role, user: admin } = res.locals;

		if (role === "admin")
			if (admin.status !== "super_admin")
				if (!admin.role?.banner?.create)
					return next(new AppError(401, "Sizni bunday vakolatingiz yoq!"));

		if (!req.file) return next(new AppError(401, "Iltimos rasm yuklang!"));

		const image = `images/${req.file.fieldname}-${uuidv4()}.png`;

		sharp(req.file.buffer).png().toFile(path.join(__dirname, "../../../uploads", image));

		const banner = await storage.banner.create({ ...req.body, image });

		res.status(201).json({
			success: true,
			data: {
				banner
			}
		});

		next();
	});

	update = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { role, user: admin } = res.locals;

		if (role === "admin")
			if (admin.status !== "super_admin")
				if (!admin.role?.banner?.update)
					return next(new AppError(401, "Sizni bunday vakolatingiz yoq!"));

		const _id = req.params.id;

		let banner = await storage.banner.findOne({ _id });

		if (req.file) {
			const image = `images/${req.file.fieldname}-${uuidv4()}.png`;

			sharp(req.file.buffer).png().toFile(path.join(__dirname, "../../../uploads", image));

			await unlink(path.join(__dirname, "../../../uploads", banner.image));

			banner.image = image;
		}

		banner = await storage.banner.update(
			{ _id },
			{
				...req.body,
				image: banner.image
			}
		);

		res.status(200).json({
			success: true,
			data: {
				banner
			}
		});

		next();
	});

	delete = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { role, user: admin } = res.locals;

		if (role === "admin")
			if (admin.status !== "super_admin")
				if (!admin.role?.banner?.delete)
					return next(new AppError(401, "Sizni bunday vakolatingiz yoq!"));

		const banner = await storage.banner.delete({ _id: req.params.id });

		await unlink(path.join(__dirname, "../../../uploads", banner.image));

		const page = req.query.page;
		delete req.query.page;

		const banners = await storage.banner.find(req.query, page ? Number(page) - 1 : 0);

		res.status(200).json({
			success: true,
			data: {
				banners
			}
		});

		next();
	});
}
