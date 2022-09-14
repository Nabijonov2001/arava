import { BannerRepo } from "../repo/banner";
import Banner, { IBanner } from "../../models/Banner";
import { logger } from "../../config/logger";
import AppError from "../../utils/appError";

export class BannerStorage implements BannerRepo {
	private scope = "storage.banner";

	async find(query: Object, page: number): Promise<IBanner[]> {
		try {
			return await Banner.find(query)
				.limit(20)
				.skip(page * 20)
				.select("-__v");
		} catch (error) {
			logger.error(`${this.scope}.find: finished with error: ${error}`);
			throw error;
		}
	}

	async findOne(query: Object): Promise<IBanner> {
		try {
			const banner = await Banner.findOne(query).select("-__v");

			if (!banner) {
				logger.warn(`${this.scope}.get failed to findOne`);
				throw new AppError(404, "Banner is not found");
			}

			return banner;
		} catch (error) {
			logger.error(`${this.scope}.findOne: finished with error: ${error}`);
			throw error;
		}
	}

	async create(payload: IBanner): Promise<IBanner> {
		try {
			return await Banner.create(payload);
		} catch (error) {
			logger.error(`${this.scope}.create: finished with error: ${error}`);
			throw error;
		}
	}

	async update(query: object, payload: IBanner): Promise<IBanner> {
		try {
			const banner = await Banner.findOneAndUpdate(query, payload, { new: true }).select(
				"-__v"
			);

			if (!banner) {
				logger.warn(`${this.scope}.update failed to findOneAndUpdate`);
				throw new AppError(404, "Banner is not found");
			}

			return banner;
		} catch (error) {
			logger.error(`${this.scope}.update: finished with error: ${error}`);
			throw error;
		}
	}

	async delete(query: object): Promise<IBanner> {
		try {
			const banner = await Banner.findOneAndDelete(query).select("-__v");

			if (!banner) {
				logger.warn(`${this.scope}.delete failed to findOneAndDelete`);
				throw new AppError(404, "Banner is not found");
			}

			return banner;
		} catch (error) {
			logger.error(`${this.scope}.delete: finished with error: ${error}`);
			throw error;
		}
	}

	async pageNumber(query: Object): Promise<number> {
		try {
			return Banner.countDocuments(query);
		} catch (error) {
			logger.error(`${this.scope}.find: finished with error: ${error}`);
			throw error;
		}
	}
}
