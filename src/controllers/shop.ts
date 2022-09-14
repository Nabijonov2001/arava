import path from "path";
import { v4 as uuidv4 } from "uuid";
import { writeFile, unlink } from "fs/promises";
import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import { storage } from "../storage/main";
import AppError from "../utils/appError";

export class ShopController {
	getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { role, user: admin } = res.locals;

		if (role === "admin")
			if (admin.status !== "super_admin")
				if (!admin.role?.shop?.get)
					return next(new AppError(401, "Sizni bunday vakolatingiz yoq!"));

		const page = req.query.page;
		delete req.query.page;

		const shops = await storage.shop.find(req.query, page ? Number(page) - 1 : 0),
			pages = await storage.shop.pageNumber(req.query);

		res.status(200).json({
			success: true,
			data: {
				shops,
				pages: Math.ceil(pages / 20)
			}
		});
	});

	getOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { role, user: admin } = res.locals;

		if (role === "admin")
			if (admin.status !== "super_admin")
				if (!admin.role?.shop?.get)
					return next(new AppError(401, "Sizni bunday vakolatingiz yoq!"));

		const shop = await storage.shop.findOne({ _id: req.params.id });

		res.status(200).json({
			success: true,
			data: {
				shop
			}
		});
	});

	create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { id } = res.locals,
			{ market_id } = req.body;

		let image;
		if (req.file) {
			image = `images/${req.file.fieldname}-${uuidv4()}${path.extname(
				req.file.originalname
			)}`;
			await writeFile(path.join(__dirname, "../../../uploads", image), req.file.buffer);
		}

		const address_id = (
			await storage.market.update({ _id: market_id }, { $inc: { shop_counts: 1 } })
		).address_id;

		const shop = await storage.shop.create({
			...req.body,
			agent_id: id,
			market_id,
			address_id,
			image
		});

		await storage.agent.update({ _id: id }, { $inc: { shop_count: 1 }, market_id });

		res.status(201).json({
			success: true,
			data: {
				shop
			}
		});
	});

	update = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { id, role, user: admin } = res.locals;

		if (role === "admin")
			if (admin.status !== "super_admin")
				if (!admin.role?.shop?.update)
					return next(new AppError(401, "Sizni bunday vakolatingiz yoq!"));

		const _id = req.params.id,
			{ image } = req.body;

		let shop = await storage.shop.findOne({ _id });

		if (shop.agent_id !== id)
			return next(new AppError(401, `Siz faqat o'zingizni do'konizi o'zgartira olasiz`));

		if (!image) {
			if (shop.image) {
				await unlink(path.join(__dirname, "../../../uploads", shop.image));
				shop.image = "";
			}
		}

		let image_path;
		if (req.file) {
			image_path = `images/${req.file.fieldname}-${uuidv4()}${path.extname(
				req.file.originalname
			)}`;
			await writeFile(path.join(__dirname, "../../../uploads", image_path), req.file.buffer);

			if (shop.image) await unlink(path.join(__dirname, "../../../uploads", shop.image));

			shop.image = image_path;
		}

		shop = await storage.shop.update(
			{ _id },
			{
				...req.body,
				image: shop.image
			}
		);

		res.status(200).json({
			success: true,
			data: {
				shop
			}
		});
	});

	delete = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { id, role, user: admin } = res.locals,
			_id = req.params.id;

		if (role === "admin")
			if (admin.status !== "super_admin")
				if (!admin.role?.shop?.delete)
					return next(new AppError(401, "Sizni bunday vakolatingiz yoq!"));

		const shop = await storage.shop.findOne({ _id });

		if (role === "agent" && shop.agent_id !== id)
			return next(new AppError(401, `Siz faqat o'zingizni do'konizi o'chira olasiz`));

		await storage.shop.delete({ _id });

		await storage.agent.update({ _id: shop.agent_id }, { $inc: { shop_count: -1 } });

		await storage.market.update({ _id: shop.market_id }, { $inc: { shop_counts: -1 } });

		if (shop.image) await unlink(path.join(__dirname, "../../../uploads", shop.image));

		const page = req.query.page;
		delete req.query.page;

		const shops = await storage.shop.find(req.query, page ? Number(page) - 1 : 0),
			pages = await storage.shop.pageNumber(req.query);

		res.status(200).json({
			success: true,
			data: {
				shops,
				pages: Math.ceil(pages / 20)
			}
		});
	});
}
