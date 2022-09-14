import path from "path";
import { v4 as uuidv4 } from "uuid";
import { writeFile, unlink } from "fs/promises";
import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import { storage } from "../storage/main";
import AppError from "../utils/appError";
import { IChart } from "../models/Chart";

export class ProductController {
	getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { role, user: admin } = res.locals;

		if (role === "admin")
			if (admin.status !== "super_admin")
				if (!admin.role?.product?.get)
					return next(new AppError(401, "Sizni bunday vakolatingiz yoq!"));

		const { page, type, search, status, category_id } = req.query as {
			[key: string]: string;
		};
		delete req.query.search;
		delete req.query.page;
		delete req.query.type;

		if (type) {
			const products = await storage.product.aggregate([
				{
					$match: {
						...req.query,
						status: status ? status : { $ne: "deleted" }
					}
				},
				{
					$project: {
						name: "$name",
						properties: "$properties"
					}
				},
				{
					$facet: {
						data: [{ $skip: (Number(page) - 1) * 20 }, { $limit: 10 }],
						metadata: [{ $count: "total" }]
					}
				}
			]);

			res.status(200).json({
				success: true,
				data: {
					products: products[0].data,
					pages: Math.ceil(products[0].metadata[0]?.total / 20)
				}
			});

			res.locals.data = {
				success: true,
				data: {
					products: products[0].data,
					pages: Math.ceil(products[0].metadata[0]?.total / 20)
				}
			};

			return next();
		}
		let products, pages;
		if (role === "admin") {
			products = await storage.product.find(
				{
					...req.query,
					status: status ? status : { $ne: "deleted" },
					category_id: category_id ? { $in: category_id.split(",") } : { $ne: null },
					$or: [
						{ name: { $regex: search.trim(), $options: "i" } },
						{ description: { $regex: search.trim(), $options: "i" } }
					]
				},
				page ? Number(page) - 1 : 0,
				role
			);
			pages = await storage.product.pageNumber({
				...req.query,
				status: status ? status : { $ne: "deleted" },
				category_id: category_id ? { $in: category_id.split(",") } : { $ne: null },
				$or: [
					{ name: { $regex: search.trim(), $options: "i" } },
					{ description: { $regex: search.trim(), $options: "i" } }
				]
			});
		} else if (role === "agent") {
			products = await storage.product.find(
				{
					...req.query,
					status: status ? status : { $ne: "deleted" },
					$or: [
						{ name: { $regex: search.trim(), $options: "i" } },
						{ description: { $regex: search.trim(), $options: "i" } }
					]
				},
				page ? Number(page) - 1 : 0,
				role
			);
			pages = await storage.product.pageNumber({
				...req.query,
				status: status ? status : { $ne: "deleted" },
				$or: [
					{ name: { $regex: search.trim(), $options: "i" } },
					{ description: { $regex: search.trim(), $options: "i" } }
				]
			});
		} else {
			products = await storage.product.find(
				{
					...req.query,
					status: "active",
					public: true,
					$or: [
						{ name: { $regex: search.trim(), $options: "i" } },
						{ description: { $regex: search.trim(), $options: "i" } }
					]
				},
				page ? Number(page) - 1 : 0,
				role
			);
			pages = await storage.product.pageNumber({
				...req.query,
				status: "active",
				$or: [
					{ name: { $regex: search.trim(), $options: "i" } },
					{ description: { $regex: search.trim(), $options: "i" } }
				]
			});
		}

		res.locals.data = {
			success: true,
			data: {
				products,
				pages: Math.ceil(pages / 20)
			}
		};

		res.status(200).json({
			success: true,
			data: {
				products,
				pages: Math.ceil(pages / 20)
			}
		});

		next();
	});

	getOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { id, role, user: admin } = res.locals;

		if (role === "admin")
			if (admin.status !== "super_admin")
				if (!admin.role?.product?.get)
					return next(new AppError(401, "Sizni bunday vakolatingiz yoq!"));

		const product = await storage.product.update(
				{ _id: req.params.id },
				{ $inc: { views: 1 } }
			),
			models = await storage.dynamic_model.find({ category_id: product.category_id }),
			prices = await storage.product_prices.find({ product_id: product._id });

		let user_rated;
		if (role === "client")
			user_rated = (await storage.rating.find({ client_id: id }, 0))[0]?.stars;

		res.status(200).json({
			success: true,
			data: {
				models,
				prices,
				product,
				user_rated
			}
		});
	});

	create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { role, user: admin } = res.locals,
			{ properties, category_id, prices, agent_id } = req.body,
			id = role !== "admin" ? res.locals.id : agent_id;

		if (role === "admin")
			if (admin.status !== "super_admin")
				if (!admin.role?.product?.update)
					return next(new AppError(401, "Sizni bunday vakolatingiz yoq!"));

		const files = req.files as { [name: string]: Express.Multer.File[] },
			images = files["images"],
			image = files["image"];

		const category = await storage.category.findOne({ _id: category_id }),
			sup_category = await storage.category.findOne({ _id: category.sup_category_id });

		let image_path;
		if (image) {
			image_path = `images/${image[0].fieldname}-${uuidv4()}${path.extname(
				image[0].originalname
			)}`;

			await writeFile(path.join(__dirname, "../../../uploads", image_path), image[0].buffer);
		}

		let n = 0,
			product_all_count = 0;
		for (const propertie of properties) {
			product_all_count += propertie.product_count;
			if (images) {
				propertie.images = [];
				if (propertie.image_count) {
					for (let i = 0; i < propertie.image_count; i++) {
						const image_path = `images/${images[n].fieldname}-${uuidv4()}${path.extname(
							images[n].originalname
						)}`;

						await writeFile(
							path.join(__dirname, "../../../uploads", image_path),
							images[n].buffer
						);

						propertie.images.push(image_path);
						n++;
					}
				}
			}
		}

		let product = await storage.product.create({
			...req.body,
			agent_id: id,
			sup_category_id: sup_category._id,
			image: image_path,
			product_all_count,
			status: role === "admin" ? "active" : "inactive"
		});

		let _prices = [];
		for (const price of prices) {
			_prices.push(
				await storage.product_prices.create({
					...price,
					product_id: product._id
				})
			);
		}

		for (const propertie of product.properties) {
			for (let i = 0; i < propertie.prices.length; i++) {
				propertie.prices[i].price = _prices[i]._id;
				propertie.prices[i].is_hidden = _prices[i].is_hidden;
				propertie.prices[i].currency = _prices[i].currency;
			}
		}

		product = await product.save();

		category.product_count++;
		sup_category.product_count++;
		await category.save();
		await sup_category.save();

		if (role === "admin")
			await storage.agent.update({ _id: id }, { $inc: { product_count: 1 } });

		res.status(201).json({
			success: true,
			data: {
				product
			}
		});

		next();
	});

	update = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { id, role, user: admin } = res.locals,
			{ type, status, recommended, counts } = req.query,
			_id = req.params.id,
			{ properties, image, prices } = req.body,
			files = req.files as { [name: string]: Express.Multer.File[] },
			images = files?.images,
			Image = files?.image;

		if (role === "admin")
			if (admin.status !== "super_admin")
				if (!admin.role?.product?.update)
					return next(new AppError(401, "Sizni bunday vakolatingiz yoq!"));

		let product = await storage.product.findOne({ _id });
		if (role !== "admin" && product.agent_id !== id)
			return next(
				new AppError(401, `Siz faqat o'zingizni mahsulotlaringiz o'zgartira olasiz`)
			);

		if (role === "admin" && (status || recommended)) {
			if (status === "active" && product.status !== "active")
				await storage.agent.update(
					{ _id: product.agent_id },
					{ $inc: { product_count: 1 } }
				);
			else if (status !== "active" && product.status === "active")
				await storage.agent.update(
					{ _id: product.agent_id },
					{ $inc: { product_count: -1 } }
				);

			product = await storage.product.update(
				{ _id },
				{
					status: status ? status : product.status,
					recommended: recommended ? recommended : product.recommended
				}
			);

			res.status(200).json({
				success: true,
				data: {
					product
				}
			});

			return next();
		}

		let product_count = 0;
		console.log(type);

		if (type) {
			let _counts = JSON.parse(counts as string);
			if (type === "sell") {
				for (let i = 0; i < product.properties.length; i++) {
					if (product.properties[i].product_count >= _counts[i]) {
						product.properties[i].product_count -= _counts[i];
						product_count += _counts[i];
					} else {
						throw new AppError(
							401,
							`Omborxonada faqat ${product.properties[i].product_count} ta mahsulot mavjud!`
						);
					}
				}
				product.product_all_count -= product_count;
			} else {
				for (let i = 0; i < product.properties.length; i++) {
					product.properties[i].product_count += _counts[i];
				}
				product.product_all_count += product_count;
			}

			const chart = await storage.chart.findOne({
				type_id: product._id,
				created_at: { $regex: new Date().toISOString().split("T").shift(), $options: "i" }
			});

			if (chart) {
				chart.count += product_count;
				await chart.save();
			} else {
				await storage.chart.create({
					type: "Product",
					count: product_count,
					type_id: product._id,
					user: "Agent",
					user_id: product.agent_id
				} as IChart);
			}

			await product.save();
			console.log(1);

			return res.status(200).json({
				success: true,
				data: {
					product
				}
			});
		}
		console.log(2);

		if (!image) {
			if (product.image)
				await unlink(path.join(__dirname, "../../../uploads", product.image));
			product.image = "";
		}

		if (properties)
			for (let i = 0; i < product.properties.length; i++) {
				for (let j = 0; j < product.properties[i].images.length; j++) {
					if (product.properties[i].images[j] && !properties[i]?.images[j]) {
						await unlink(
							path.join(
								__dirname,
								"../../../uploads",
								product.properties[i].images[j]
							)
						);
					}
				}
			}

		if (Image) {
			if (product.image)
				await unlink(path.join(__dirname, "../../../uploads", product.image));

			product.image = `images/${Image[0].fieldname}-${uuidv4()}${path.extname(
				Image[0].originalname
			)}`;

			await writeFile(
				path.join(__dirname, "../../../uploads", product.image),
				Image[0].buffer
			);
		}

		if (images) {
			let n = 0;
			for (const propertie of properties) {
				propertie.images ? propertie.images : (propertie.images = []);
				if (propertie.image_count) {
					for (let i = 0; i < propertie.image_count; i++) {
						const image_path = `images/${images[n].fieldname}-${uuidv4()}${path.extname(
							images[n].originalname
						)}`;
						await writeFile(
							path.join(__dirname, "../../../uploads", image_path),
							images[n].buffer
						);

						propertie.images.push(image_path);

						n++;
					}
				}
			}
		}

		const chart = await storage.chart.findOne({
			type_id: product._id,
			created_at: { $regex: new Date().toISOString().split("T").shift(), $options: "i" },
			user_id: product.agent_id
		});

		if (chart) {
			chart.count++;
			await chart.save();
		} else {
			await storage.chart.create({
				type: "Product",
				count: 1,
				type_id: product._id,
				user: "Agent",
				user_id: product.agent_id
			} as IChart);
		}

		product = await storage.product.update(
			{ _id },
			{
				...req.body,
				image: product.image
			}
		);

		await storage.product_prices.deleteMany({ product_id: product._id });

		let _prices = [];
		for (const price of prices) {
			_prices.push(
				await storage.product_prices.create({
					...price,
					product_id: product._id
				})
			);
		}

		for (const propertie of product.properties) {
			for (let i = 0; i < propertie.prices.length; i++) {
				propertie.prices[i].price = _prices[i]._id;
				propertie.prices[i].is_hidden = _prices[i].is_hidden;
				propertie.prices[i].currency = _prices[i].currency;
			}
		}

		product = await product.save();

		res.status(200).json({
			success: true,
			data: {
				product
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
				if (!admin.role?.product?.delete)
					return next(new AppError(401, "Sizni bunday vakolatingiz yoq!"));

		const product = await storage.product.findOne({ _id });

		if (product.agent_id !== id && role !== "admin")
			return next(new AppError(401, `Siz faqat o'zingizni mahsulotlaringiz o'chira olasiz`));

		const complaint = (await storage.complaint.find({ product_id: _id, read: false }))[0];

		if (complaint)
			return next(
				new AppError(
					401,
					`Bu mahsulot ustidan shikoyat tushgan adminlar ko'ribchiqishganidan keyin o'chira olasiz!`
				)
			);

		await storage.product.update({ _id }, { status: "deleted" });

		if (role === "admin" && admin.status === "super_admin" && status === "delete") {
			await storage.product.delete({ _id });
			await storage.product_prices.deleteMany({ product_id: _id });

			if (product.image)
				await unlink(path.join(__dirname, "../../../uploads", product.image));

			for (const propertie of product.properties) {
				if (propertie.images)
					for (const image of propertie.images) {
						await unlink(path.join(__dirname, "../../../uploads", image));
					}
			}
		}

		await storage.category.update(
			{ _id: product.category_id },
			{ $inc: { product_count: -1 } }
		);
		await storage.category.update(
			{ _id: product.sup_category_id },
			{ $inc: { product_count: -1 } }
		);
		await storage.comment.deleteMany({ product_id: _id });
		await storage.rating.deleteMany({ type_id: _id });
		await storage.favourite.deleteMany({ product_id: _id });
		await storage.phone_view.deleteMany({ product_id: _id });

		if (product.status === "active")
			await storage.agent.update({ _id: product.agent_id }, { $inc: { product_count: -1 } });

		res.status(200).json({ success: true });

		next();
	});

	clientInterests = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { id, user } = res.locals,
			{ page } = req.query,
			favourites = await storage.favourite.aggregate([
				{
					$match: { client_id: id }
				},
				{
					$sortByCount: "$category_id"
				},
				{
					$sort: { createdAt: -1 }
				},
				{
					$limit: 3
				}
			]),
			phone_views = await storage.phone_view.aggregate([
				{
					$match: { client_id: id }
				},
				{
					$sortByCount: "$category_id"
				},
				{
					$sort: { createdAt: -1 }
				},
				{
					$limit: 3
				}
			]),
			demand = await storage.demand.aggregate([
				{
					$match: { client_id: id }
				},
				{
					$sortByCount: "$category_id"
				},
				{
					$sort: { createdAt: -1 }
				},
				{
					$limit: 3
				}
			]),
			categories: any = [...demand, ...favourites, ...phone_views],
			_ids: string[] = [...user.interests];

		for (const category of categories) {
			_ids.push(category._id);
		}

		const product = await storage.product.find(
			{ category_id: { $in: _ids } },
			page ? Number(page) : 0
		);

		res.status(200).json({
			success: true,
			data: {
				product
			}
		});
	});
}
