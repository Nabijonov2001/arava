import { RatingRepo } from "../repo/rating";
import Rating, { IRating } from "../../models/Rating";
import { logger } from "../../config/logger";
import AppError from "../../utils/appError";
import Comment from "../../models/Comment";

export class RatingStorage implements RatingRepo {
	private scope = "storage.rating";

	async find(query: Object, page?: number): Promise<IRating[]> {
		try {
			if (typeof page === "number")
				return await Rating.find(query)
					.limit(20)
					.skip(page * 20)
					.select("-__v -updatedAt")
					.populate([
						{ path: "type_id", select: "name image first_name last_name" },
						{ path: "client_id", select: "first_name last_name image" }
					]);
			else return await Rating.find(query).select("-__v");
		} catch (error) {
			logger.error(`${this.scope}.find: finished with error: ${error}`);
			throw error;
		}
	}

	async findOne(query: Object): Promise<IRating> {
		try {
			const rating = await Rating.findOne(query).populate(
				"client_id",
				"first_name last_name image"
			);

			if (!rating) {
				logger.warn(`${this.scope}.get failed to findOne`);
				throw new AppError(404, "Rating is not found");
			}

			return rating;
		} catch (error) {
			logger.error(`${this.scope}.findOne: finished with error: ${error}`);
			throw error;
		}
	}

	async create(payload: IRating): Promise<IRating> {
		try {
			return await Rating.create(payload);
		} catch (error) {
			logger.error(`${this.scope}.create: finished with error: ${error}`);
			throw error;
		}
	}

	async deleteMany(query: Object): Promise<Object> {
		try {
			return await Rating.deleteMany(query);
		} catch (error) {
			logger.error(`${this.scope}.delete: finished with error: ${error}`);
			throw error;
		}
	}

	async pageNumber(query: Object): Promise<number> {
		try {
			return Rating.countDocuments(query);
		} catch (error) {
			logger.error(`${this.scope}.find: finished with error: ${error}`);
			throw error;
		}
	}
}
