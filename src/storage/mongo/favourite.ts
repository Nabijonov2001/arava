import { FavouriteRepo, IFavouriteAllResponse } from "../repo/favourite";
import Favourite, { IFavourite } from "../../models/Favourite";
import { logger } from "../../config/logger";
import AppError from "../../utils/appError";
import Comment from "../../models/Comment";

export class FavouriteStorage implements FavouriteRepo {
	private scope = "storage.favourite";

	async find(query: Object): Promise<IFavourite[]> {
		try {
			return await Favourite.find(query)
				.populate({
					path: "type_id",
					select: `first_name last_name address_id telegram_username phone_number image description product_count product_name name address images createdAt`,
					populate: [
						{
							path: "address_id",
							select: "name"
						},
						{
							path: "client_id",
							select: "telegram_username phone_number"
						},
						{
							path: "address",
							select: "name"
						}
					]
				})
				.select("-__v -category_id");
		} catch (error) {
			logger.error(`${this.scope}.find: finished with error: ${error}`);
			throw error;
		}
	}

	async findOne(query: Object): Promise<IFavourite> {
		try {
			const favourite = await Favourite.findOne(query).populate("type_id").select("-__v");

			if (!favourite) {
				logger.warn(`${this.scope}.get failed to findOne`);
				throw new AppError(404, "Favourite is not found");
			}

			return favourite;
		} catch (error) {
			logger.error(`${this.scope}.findOne: finished with error: ${error}`);
			throw error;
		}
	}

	async create(payload: IFavourite): Promise<IFavourite> {
		try {
			return await Favourite.create(payload);
		} catch (error) {
			logger.error(`${this.scope}.create: finished with error: ${error}`);
			throw error;
		}
	}

	async delete(query: object): Promise<IFavourite> {
		try {
			const favourite = await Favourite.findOneAndDelete(query).select("-__v");

			if (!favourite) {
				logger.warn(`${this.scope}.delete failed to findOneAndDelete`);
				throw new AppError(404, "Favourite is not found");
			}

			return favourite;
		} catch (error) {
			logger.error(`${this.scope}.delete: finished with error: ${error}`);
			throw error;
		}
	}

	async deleteMany(query: Object): Promise<Object> {
		try {
			return await Favourite.deleteMany(query).select("-__v");
		} catch (error) {
			logger.error(`${this.scope}.delete: finished with error: ${error}`);
			throw error;
		}
	}

	async pageNumber(query: Object): Promise<number> {
		try {
			return Favourite.countDocuments(query);
		} catch (error) {
			logger.error(`${this.scope}.find: finished with error: ${error}`);
			throw error;
		}
	}

	async aggregate(queries: Object[]): Promise<Object[]> {
		try {
			return await Favourite.aggregate(queries);
		} catch (error) {
			logger.error(`${this.scope}.delete: finished with error: ${error}`);
			throw error;
		}
	}
}
