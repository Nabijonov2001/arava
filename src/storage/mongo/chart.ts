import { ChartRepo } from "../repo/chart";
import Chart, { IChart } from "../../models/Chart";
import { logger } from "../../config/logger";
import AppError from "../../utils/appError";

export class ChartStorage implements ChartRepo {
	private scope = "storage.chart";

	async find(query: Object): Promise<IChart[]> {
		try {
			return await Chart.find(query)
				.populate({ path: "type_id", select: "name" })
				.select("-__v");
		} catch (error) {
			logger.error(`${this.scope}.find: finished with error: ${error}`);
			throw error;
		}
	}

	async findOne(query: Object): Promise<IChart> {
		try {
			const chart = (await Chart.findOne(query).select("-__v")) as IChart;

			return chart;
		} catch (error) {
			logger.error(`${this.scope}.update: finished with error: ${error}`);
			throw error;
		}
	}

	async create(payload: IChart): Promise<IChart> {
		try {
			return await Chart.create(payload);
		} catch (error) {
			logger.error(`${this.scope}.create: finished with error: ${error}`);
			throw error;
		}
	}
}
