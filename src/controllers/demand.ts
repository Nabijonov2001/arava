import path from "path";
import { v4 as uuidv4 } from "uuid";
import { writeFile, unlink } from "fs/promises";
import { NextFunction, Request, Response } from "express";
import { storage } from "../storage/main";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";
import { IDemand } from "../models/Demand";

export class DemandController {
	getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { role, user } = res.locals,
			{ search, page, status, category_id } = req.query as { [key: string]: string };
		delete req.query.search;
		delete req.query.page;

		let demands, pages;
		if (role !== "admin") {
			demands = await storage.demand.find(
				{
					...req.query,
					category_id: category_id ? category_id : { $in: user.interests },
					status: status ? status : { $ne: "deleted" },
					$or: [
						{ product_name: { $regex: search.trim(), $options: "i" } },
						{ description: { $regex: search.trim(), $options: "i" } }
					]
				},
				page ? Number(page) - 1 : 0,
				role
			);
			pages = await storage.demand.pageNumber({
				...req.query,
				category_id: category_id ? category_id : { $in: user.interests },
				status: status ? status : { $ne: "deleted" },
				$or: [
					{ product_name: { $regex: search.trim(), $options: "i" } },
					{ description: { $regex: search.trim(), $options: "i" } }
				]
			});

			if (!category_id && demands.length < 11) {
				demands.push(
					...(await storage.demand.find(
						{
							...req.query,
							status: status ? status : { $ne: "deleted" },
							$or: [
								{ product_name: { $regex: search.trim(), $options: "i" } },
								{ description: { $regex: search.trim(), $options: "i" } }
							]
						},
						page ? Number(page) - 1 : 0,
						role
					))
				);

				pages += await storage.demand.pageNumber({
					...req.query,
					status: status ? status : { $ne: "deleted" },
					$or: [
						{ product_name: { $regex: search.trim(), $options: "i" } },
						{ description: { $regex: search.trim(), $options: "i" } }
					]
				});
			}
		} else {
			demands = await storage.demand.find(
				{
					...req.query,
					status: status ? status : { $ne: "deleted" },
					$or: [
						{ product_name: { $regex: search.trim(), $options: "i" } },
						{ description: { $regex: search.trim(), $options: "i" } }
					]
				},
				page ? Number(page) - 1 : 0,
				role
			);
			pages = await storage.demand.pageNumber({
				...req.query,
				status: status ? status : { $ne: "deleted" },
				$or: [
					{ product_name: { $regex: search.trim(), $options: "i" } },
					{ description: { $regex: search.trim(), $options: "i" } }
				]
			});
		}

		let count;
		if (role === "admin")
			count = await storage.demand.pageNumber({
				read: false,
				status: "inactive"
			});

		res.locals.data = {
			success: true,
			data: {
				demands,
				pages: Math.ceil(pages / 20),
				count
			}
		};

		res.status(200).json({
			success: true,
			data: {
				demands,
				pages: Math.ceil(pages / 20),
				count
			}
		});

		// next();
	});

	getOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const demand = await storage.demand.update({ _id: req.params.id }, {
			read: true
		} as IDemand);

		res.status(200).json({
			success: true,
			data: {
				demand
			}
		});
	});

	create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { id } = res.locals,
			{ category_id } = req.body;

		let images = [];
		if (req.files) {
			for (const image of req.files as Express.Multer.File[]) {
				const image_path = `images/${image.fieldname}-${uuidv4()}${path.extname(
					image.originalname
				)}`;
				await writeFile(path.join(__dirname, "../../../uploads", image_path), image.buffer);
				images.push(image_path);
			}
		}

		const demand = await storage.demand.create({
			...req.body,
			client_id: id,
			category_id,
			images
		});

		res.status(201).json({
			success: true,
			data: {
				demand
			}
		});

		next();
	});

	update = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { id, role, user: admin } = res.locals,
			_id = req.params.id,
			{ images } = req.body;

		if (role === "admin")
			if (admin.status !== "super_admin")
				if (!admin.role?.demand?.update)
					return next(new AppError(401, "Sizni bunday vakolatingiz yoq!"));

		let demand: any = await storage.demand.findOne({ _id });

		if (role !== "admin" && demand.client_id._id !== id)
			return next(new AppError(401, `Siz faqat o'zingizning talabingizni o'zgartira olasiz`));

		if (images) {
			let imgs = [];
			for (let i = 0; i < demand.images.length; i++) {
				if (images[i] !== demand.images[i]) {
					await unlink(path.join(__dirname, "../../../uploads", demand.images[i]));
				} else {
					imgs.push(demand.images[i]);
				}
			}
			demand.images = imgs;
		}

		if (req.files) {
			for (const image of req.files as Express.Multer.File[]) {
				const image_path = `images/${image.fieldname}-${uuidv4()}${path.extname(
					image.originalname
				)}`;
				await writeFile(path.join(__dirname, "../../../uploads", image_path), image.buffer);
				demand.images.push(image_path);
			}
		}

		demand = await storage.demand.update({ _id }, { ...req.body, images: demand.images });

		res.status(200).json({
			success: true,
			data: {
				demand
			}
		});

		next();
	});

	delete = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { id, role, user: admin } = res.locals,
			{ status } = req.query,
			_id = req.params.id;

		if (role === "admin")
			if (admin.status !== "super_admin")
				if (!admin.role?.demand?.delete)
					return next(new AppError(401, "Sizni bunday vakolatingiz yoq!"));

		const demand: any = await storage.demand.findOne({ _id });

		if (role !== "admin" && demand.client_id._id !== id)
			return next(new AppError(401, `Siz faqat o'zingizning talabingizni o'chira olasiz`));

		await storage.favourite.deleteMany({ type_id: _id });
		await storage.demand.update({ _id }, { status: "deleted" } as IDemand);

		if (role === "admin" && admin.status === "super_admin" && status === "delete") {
			if (demand.images.length) {
				for (const image of demand.images) {
					await unlink(path.join(__dirname, "../../../uploads", image));
				}
			}

			await storage.demand.delete({ _id });
		}

		res.status(200).json({ success: true });

		next();
	});
}
