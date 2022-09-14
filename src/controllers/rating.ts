import { NextFunction, Request, Response } from "express";
import { IAgent } from "../models/Agent";
import { IProduct } from "../models/Product";
import { storage } from "../storage/main";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
import { clear } from "../middleware/cache";

export class RatingController {
	getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { id, role, user: admin } = res.locals;

		if (role === "admin")
			if (admin.status !== "super_admin")
				if (!admin.role?.rating?.get)
					return next(new AppError(401, "Sizni bunday vakolatingiz yoq!"));

		const page = req.query.page;
		delete req.query.page;

		const ratings = await storage.rating.find(req.query, page ? Number(page) - 1 : 0),
			pages = await storage.rating.pageNumber(req.query);

		res.locals.data = {
			success: true,
			data: {
				ratings,
				pages: Math.ceil(pages / 20)
			}
		};

		res.status(200).json({
			success: true,
			data: {
				ratings,
				pages: Math.ceil(pages / 20)
			}
		});
		next();
	});

	getOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { role, user: admin } = res.locals;

		if (role === "admin")
			if (admin.status !== "super_admin")
				if (!admin.role?.rating?.get)
					return next(new AppError(401, "Sizni bunday vakolatingiz yoq!"));

		const rating = await storage.rating.findOne({ _id: req.params.id });

		res.status(200).json({
			success: true,
			data: {
				rating
			}
		});
	});

	create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { id } = res.locals,
			{ type, type_id } = req.body;

		const rating = await storage.rating.create({ ...req.body, client_id: id });
		const ratings = await storage.rating.find({ type: rating.type });

		if (ratings[0]) {
			let stars = 0;
			for (const rating of ratings) {
				stars += rating.stars;
			}

			if (type == "Product")
				await storage.product.update(
					{ _id: type_id },
					{
						$inc: { star_count: 1 },
						rating_star: stars / ratings.length
					}
				);
			else if (type == "Agent")
				await storage.agent.update(
					{ _id: type_id },
					{
						$inc: { star_count: 1 },
						rating_star: stars / ratings.length
					}
				);
		} else {
			if (type == "Product")
				await storage.product.update(
					{ _id: type_id },
					{
						$inc: { star_count: 1 },
						rating_star: rating.stars
					}
				);
			else if (type == "Agent")
				await storage.agent.update(
					{ _id: type_id },
					{
						$inc: { star_count: 1 },
						rating_star: rating.stars
					}
				);
		}

		if (type === "Agent") {
			const agents = await storage.agent.find({ star_count: { $gte: 5 } }),
				ratings = await storage.rating.find({ type: "Agent" });

			let n = 0;
			for (const rating of ratings) {
				n += rating.stars;
			}

			n /= ratings.length;

			for (let i = 0; i < agents.length; i++) {
				agents[i].rating =
					(agents[i].rating_star * agents[i].star_count + n * 1) /
					(agents[i].star_count + 1);

				await agents[i].save();
			}
		}

		res.status(201).json({
			success: true,
			data: {
				rating
			}
		});

		next();
	});
}
