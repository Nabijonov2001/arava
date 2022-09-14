import { ShopRepo, IShopAllResponse } from "../repo/shop";
import Shop, { IShop } from "../../models/Shop";
import { logger } from "../../config/logger";
import AppError from "../../utils/appError";

export class ShopStorage implements ShopRepo {
	private scope = "storage.shop";

	async find(query: Object, page: number): Promise<IShop[]> {
		try {
			return await Shop.find(query)
				.limit(20)
				.skip(page * 20)
				.select("name product_quantity image description")
				.populate("address_id", "name");
		} catch (error) {
			logger.error(`${this.scope}.find: finished with error: ${error}`);
			throw error;
		}
	}

	async findOne(query: Object): Promise<IShop> {
		try {
			const shop = await Shop.findOne(query);

			if (!shop) {
				logger.warn(`${this.scope}.get failed to findOne`);
				throw new AppError(404, "Shop is not found");
			}

			return shop;
		} catch (error) {
			logger.error(`${this.scope}.findOne: finished with error: ${error}`);
			throw error;
		}
	}

	async create(payload: IShop): Promise<IShop> {
		try {
			return await Shop.create(payload);
		} catch (error) {
			logger.error(`${this.scope}.create: finished with error: ${error}`);
			throw error;
		}
	}

	async update(query: object, payload: IShop | Object): Promise<IShop> {
		try {
			const shop = await Shop.findOneAndUpdate(query, payload, { new: true });

			if (!shop) {
				logger.warn(`${this.scope}.update failed to findOneAndUpdate`);
				throw new AppError(404, "Shop is not found");
			}

			return shop;
		} catch (error) {
			logger.error(`${this.scope}.update: finished with error: ${error}`);
			throw error;
		}
	}

	async delete(query: object): Promise<IShop> {
		try {
			const shop = await Shop.findOneAndDelete(query);

			if (!shop) {
				logger.warn(`${this.scope}.delete failed to findOneAndDelete`);
				throw new AppError(404, "Shop is not found");
			}

			return shop;
		} catch (error) {
			logger.error(`${this.scope}.delete: finished with error: ${error}`);
			throw error;
		}
	}

	async deleteMany(query: Object): Promise<Object> {
		try {
			return await Shop.deleteMany(query);
		} catch (error) {
			logger.error(`${this.scope}.delete: finished with error: ${error}`);
			throw error;
		}
	}

	async pageNumber(query: Object): Promise<number> {
		try {
			return Shop.countDocuments(query);
		} catch (error) {
			logger.error(`${this.scope}.find: finished with error: ${error}`);
			throw error;
		}
	}
}
