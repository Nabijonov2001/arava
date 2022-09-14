import { NextFunction, Request, Response } from "express";
import { logger } from "../config/logger";
import { storage } from "../storage/main";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";
import { v4 as uuidv4 } from "uuid";
import { writeFile, unlink } from "fs/promises";
import sharp from "sharp";
import path from "path";

export class CategoryController {
	getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { role, user: admin } = res.locals,
			{ status, page, sup_category_id, type } = req.query;
		delete req.query.page;
		delete req.query.type;

		if (role === "admin")
			if (admin.status !== "super_admin")
				if (!admin.role?.category?.get)
					return next(new AppError(401, "Sizni bunday vakolatingiz yoq!"));

		let categories;
		if (type === "all") {
			categories = await storage.category.aggregate([
				{
					$match: {
						...req.query,
						status: status ? status : { $ne: "deleted" }
					}
				},
				{
					$project: {
						_id: "$_id",
						name: "$name",
						icon_svg: "$icon_svg",
						sup_category_id: "$sup_category_id"
					}
				}
			]);
		} else {
			req.query.sup_category_id = sup_category_id ? sup_category_id : (null as any);

			categories = await storage.category.find(
				{ ...req.query, status: status ? status : { $ne: "deleted" } },
				page ? Number(page) - 1 : 0
			);
		}

		res.locals.data = {
			success: true,
			data: {
				categories
			}
		};

		res.status(200).json({
			success: true,
			data: {
				categories
			}
		});

		next();
	});

	getOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { role, user: admin } = res.locals;

		if (role === "admin")
			if (admin.status !== "super_admin")
				if (!admin.role?.category?.get)
					return next(new AppError(401, "Sizni bunday vakolatingiz yoq!"));

		const category = await storage.category.update(
			{ _id: req.params.id },
			{ $inc: { views: 1 } }
		);

		res.status(200).json({
			success: true,
			data: {
				category
			}
		});
	});

	create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { role, user: admin } = res.locals,
			{ sup_category_id } = req.body;

		if (role === "admin")
			if (admin.status !== "super_admin")
				if (!admin.role?.category?.create)
					return next(new AppError(401, "Sizni bunday vakolatingiz yoq!"));

		let icon = "";
		if (req.file) {
			icon = `icons/${req.file.fieldname}-${uuidv4()}`;

			sharp(req.file.buffer)
				.png()
				.toFile(path.join(__dirname, "../../../uploads", `${icon}.png`));

			await writeFile(
				path.join(__dirname, "../../../uploads", `${icon}.svg`),
				req.file.buffer
			);
		}

		if (sup_category_id)
			await storage.category.update(
				{ _id: sup_category_id },
				{ $inc: { category_count: 1 } }
			);

		const category = await storage.category.create({
			...req.body,
			icon_svg: icon ? `${icon}.svg` : "",
			icon_png: icon ? `${icon}.png` : ""
		});

		res.status(201).json({
			success: true,
			data: {
				category
			}
		});

		next();
	});

	update = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { role, user: admin } = res.locals;

		if (role === "admin")
			if (admin.status !== "super_admin")
				if (!admin.role?.category?.update)
					return next(new AppError(401, "Sizni bunday vakolatingiz yoq!"));

		const { icon } = req.body,
			_id = req.params.id;

		let category = await storage.category.findOne({ _id });

		if (!icon && category.icon_svg) {
			await unlink(path.join(__dirname, "../../../uploads", category.icon_svg));
			await unlink(path.join(__dirname, "../../../uploads", category.icon_png));

			category.icon_svg = "";
			category.icon_png = "";
		}

		if (req.file) {
			const _icon = `icons/${req.file.fieldname}-${uuidv4()}`;

			sharp(req.file.buffer)
				.png()
				.toFile(path.join(__dirname, "../../../uploads", `${_icon}.png`));

			await writeFile(
				path.join(__dirname, "../../../uploads", `${_icon}.svg`),
				req.file.buffer
			);

			if (category.icon_svg) {
				await unlink(path.join(__dirname, "../../../uploads", category.icon_svg));
				await unlink(path.join(__dirname, "../../../uploads", category.icon_png));
			}

			category.icon_svg = `${_icon}.svg`;
			category.icon_png = `${_icon}.png`;
		}

		category = await storage.category.update(
			{ _id },
			{
				...req.body,
				icon_svg: category.icon_svg,
				icon_png: category.icon_png
			}
		);

		res.status(200).json({
			success: true,
			data: {
				category
			}
		});

		next();
	});

	delete = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { role, user: admin } = res.locals,
			{ status } = req.query,
			_id = req.params.id;

		if (role === "admin")
			if (admin.status !== "super_admin")
				if (!admin.role?.category?.delete)
					return next(new AppError(401, "Sizni bunday vakolatingiz yoq!"));

		const category = await storage.category.findOne({ _id });

		if (category.product_count || category.category_count)
			throw new AppError(
				400,
				"Bu toifaga mahsulot yoki toifa biriktirilgan tekshirib qaytadan urinib ko'ring"
			);

		if (category.sup_category_id)
			await storage.category.update(
				{ _id: category.sup_category_id },
				{ $inc: { category_count: -1 } }
			);

		await storage.category.update({ _id }, { status: "deleted" });
		await storage.unit.updateMany({ category_ids: _id }, { $pull: { category_ids: _id } });

		if (role === "admin" && admin.status === "super_admin" && status === "delete") {
			await storage.category.delete({ _id });

			if (category.icon_svg) {
				await unlink(path.join(__dirname, "../../../uploads", category.icon_svg));
				await unlink(path.join(__dirname, "../../../uploads", category.icon_png));
			}
		}

		res.status(200).json({ success: true });

		next();
	});
}
