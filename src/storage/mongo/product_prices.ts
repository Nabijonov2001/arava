import { Product_pricesRepo } from "../repo/product_prices";
import Product_prices, { IProduct_prices } from "../../models/Product_prices";
import { logger } from "../../config/logger";
import AppError from "../../utils/appError";

export class Product_pricesStorage implements Product_pricesRepo {
	private scope = "storage.product_prices";

	async find(query: Object): Promise<IProduct_prices[]> {
		try {
			return await Product_prices.find(query).select("-__v");
		} catch (error) {
			logger.error(`${this.scope}.find: finished with error: ${error}`);
			throw error;
		}
	}

	async findOne(query: Object): Promise<IProduct_prices> {
		try {
			const product_prices = await Product_prices.findOne(query).select("-__v");

			if (!product_prices) {
				logger.warn(`${this.scope}.get failed to findOne`);
				throw new AppError(404, "Product prices is not found");
			}

			return product_prices;
		} catch (error) {
			logger.error(`${this.scope}.findOne: finished with error: ${error}`);
			throw error;
		}
	}

	async create(payload: IProduct_prices): Promise<IProduct_prices> {
		try {
			return await Product_prices.create(payload);
		} catch (error) {
			logger.error(`${this.scope}.create: finished with error: ${error}`);
			throw error;
		}
	}

	async update(query: Object, payload: IProduct_prices): Promise<IProduct_prices> {
		try {
			const product_prices = await Product_prices.findOneAndUpdate(query, payload, {
				new: true
			}).select("-__v");

			if (!product_prices) {
				logger.warn(`${this.scope}.update failed to findOneAndUpdate`);
				throw new AppError(404, "Product prices is not found");
			}

			return product_prices;
		} catch (error) {
			logger.error(`${this.scope}.update: finished with error: ${error}`);
			throw error;
		}
	}

	async delete(query: Object): Promise<IProduct_prices> {
		try {
			const product_prices = await Product_prices.findOneAndDelete(query).select("-__v");

			if (!product_prices) {
				logger.warn(`${this.scope}.delete failed to findOneAndDelete`);
				throw new AppError(404, "Product prices is not found");
			}

			return product_prices;
		} catch (error) {
			logger.error(`${this.scope}.delete: finished with error: ${error}`);
			throw error;
		}
	}

	async deleteMany(query: Object): Promise<Object> {
		try {
			return await Product_prices.deleteMany(query).select("-__v");
		} catch (error) {
			logger.error(`${this.scope}.delete: finished with error: ${error}`);
			throw error;
		}
	}
}
