import { MarketRepo, IMarketAllResponse } from "../repo/market";
import Market, { IMarket } from "../../models/Market";
import { logger } from "../../config/logger";
import AppError from "../../utils/appError";

export class MarketStorage implements MarketRepo {
	private scope = "storage.market";

	async find(query: Object): Promise<IMarket[]> {
		try {
			return await Market.find(query).select("-__v");
		} catch (error) {
			logger.error(`${this.scope}.find: finished with error: ${error}`);
			throw error;
		}
	}

	async findOne(query: Object): Promise<IMarket> {
		try {
			const market = await Market.findOne(query)
				.populate("address_id", "name")
				.select("-__v");

			if (!market) {
				logger.warn(`${this.scope}.get failed to findOne`);
				throw new AppError(404, "Market is not found");
			}

			return market;
		} catch (error) {
			logger.error(`${this.scope}.findOne: finished with error: ${error}`);
			throw error;
		}
	}

	async create(payload: IMarket): Promise<IMarket> {
		try {
			return await Market.create(payload);
		} catch (error) {
			logger.error(`${this.scope}.create: finished with error: ${error}`);
			throw error;
		}
	}

	async update(query: Object, payload: IMarket | Object): Promise<IMarket> {
		try {
			const market = await Market.findOneAndUpdate(query, payload, { new: true }).select(
				"-__v"
			);

			if (!market) {
				logger.warn(`${this.scope}.update failed to findOneAndUpdate`);
				throw new AppError(404, "Market is not found");
			}

			return market;
		} catch (error) {
			logger.error(`${this.scope}.update: finished with error: ${error}`);
			throw error;
		}
	}

	async delete(query: object): Promise<IMarket> {
		try {
			const market = await Market.findOneAndDelete(query).select("-__v");

			if (!market) {
				logger.warn(`${this.scope}.delete failed to findOneAndDelete`);
				throw new AppError(404, "Market is not found");
			}

			return market;
		} catch (error) {
			logger.error(`${this.scope}.delete: finished with error: ${error}`);
			throw error;
		}
	}
}
