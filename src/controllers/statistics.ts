import { NextFunction, Request, Response } from "express";
import Chart from "../models/Chart";
import { storage } from "../storage/main";
import catchAsync from "../utils/catchAsync";

export class StatisticsController {
	getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const agent_count = await storage.agent.pageNumber(req.query),
			product_count = await storage.product.pageNumber(req.query),
			category_count = await storage.category.pageNumber(req.query),
			damand_count = await storage.demand.pageNumber(req.query);

		res.status(200).json({
			success: true,
			data: {
				agent_count,
				product_count,
				category_count,
				damand_count
			}
		});
	});

	getAgent = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { id } = res.locals,
			{ date } = req.query;
		delete req.query.date;

		const chart = await storage.chart.find({
			user_id: res.locals.id,
			created_at: { $gte: date }
		});

		const carts = await Chart.aggregate([
			{ $match: { user_id: id } },
			{
				$sortByCount: "$type_id"
			},
			{ $limit: 4 }
		]);

		const _ids: string[] = [];

		for (const cart of carts) {
			_ids.push(cart._id);
		}

		const diogramma = await storage.chart.find({ type_id: { $in: _ids } });

		res.status(200).json({
			success: true,
			data: {
				chart,
				diogramma
			}
		});
	});

	getClient = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { id } = res.locals,
			saved_agents_count = await storage.favourite.pageNumber({
				user_id: id,
				type: "Agent"
			}),
			saved_product_count = await storage.favourite.pageNumber({
				user_id: id,
				type: "Product"
			}),
			saved_demand_count = await storage.favourite.pageNumber({
				user_id: id,
				type: "Demand"
			}),
			active_demand = await storage.demand.pageNumber({
				client_id: id,
				status: "active"
			}),
			inactive_demand = await storage.demand.pageNumber({
				client_id: id,
				status: "inactive"
			}),
			blocked_demand = await storage.demand.pageNumber({
				client_id: id,
				status: "blocked"
			});

		res.status(200).json({
			success: true,
			data: {
				saved_agents_count,
				saved_product_count,
				saved_demand_count,
				active_demand,
				inactive_demand,
				blocked_demand
			}
		});
	});
}
