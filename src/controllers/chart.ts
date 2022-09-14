import { NextFunction, Request, Response } from "express";
import { storage } from "../storage/main";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";

export class ChartController {
	getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const chart = await storage.chart.find(req.query);

		res.status(200).json({
			success: true,
			data: {
				client: chart
			}
		});
	});
}
