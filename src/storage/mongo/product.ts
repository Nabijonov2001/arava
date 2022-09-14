import { ProductRepo } from "../repo/product";
import Product, { IProduct } from "../../models/Product";
import { logger } from "../../config/logger";
import AppError from "../../utils/appError";

export class ProductStorage implements ProductRepo {
	private scope = "storage.product";

	async find(query: Object, page?: number, role?: string): Promise<IProduct[]> {
		try {
			if (typeof page === "number")
				if (role === "admin")
					return await Product.find(query)
						.limit(20)
						.skip(page * 20)
						.select("name product_all_count image status recommended")
						.sort({ createdAt: -1 })
						.populate([
							{
								path: "agent_id",
								select: "first_name last_name"
							},
							{ path: "sup_category_id", select: "name" },
							{ path: "category_id", select: "name" }
						]);
				else if (role === "agent")
					return await Product.find(query)
						.limit(20)
						.skip(page * 20)
						.select("name image poblic");
				else
					return await Product.find(query)
						.limit(20)
						.skip(page * 20)
						.select("name rating_star image")
						.sort({ rating_star: -1 })
						.populate([
							{
								path: "agent_id",
								select: "phone_number telegram_username -_id"
							},
							{ path: "unit", select: "short_name -_id" }
						]);
			else return await Product.find(query).select("image properties");
		} catch (error) {
			logger.error(`${this.scope}.find: finished with error: ${error}`);
			throw error;
		}
	}

	async findOne(query: Object, key?: string): Promise<IProduct> {
		try {
			let product;
			if (key)
				product = await Product.findOne(query)
					.select("-__v -properties.models._id ")
					.populate([
						{ path: "unit", select: "-__v -_id -category_ids" },
						{ path: "agent_id", select: "first_name last_name image phone_number" }
					]);
			else {
				product = await Product.findOne(query).select("-__v");
			}

			if (!product) {
				logger.warn(`${this.scope}.get failed to findOne`);
				throw new AppError(404, "Product is not found");
			}

			return product;
		} catch (error) {
			logger.error(`${this.scope}.findOne: finished with error: ${error}`);
			throw error;
		}
	}

	async create(payload: IProduct): Promise<IProduct> {
		try {
			return await Product.create(payload);
		} catch (error) {
			logger.error(`${this.scope}.create: finished with error: ${error}`);
			throw error;
		}
	}

	async update(query: object, payload: IProduct | Object): Promise<IProduct> {
		try {
			const product = await Product.findOneAndUpdate(query, payload, { new: true })
				.select("-__v -properties.models._id")
				.populate([
					{ path: "unit", select: "-__v -category_ids" },
					{
						path: "agent_id",
						select: "first_name last_name image phone_number product_count telegram_username"
					},
					{ path: "sup_category_id", select: "name icon_svg icon_png" },
					{ path: "category_id", select: "name" }
				]);

			if (!product) {
				logger.warn(`${this.scope}.update failed to findOneAndUpdate`);
				throw new AppError(404, "Product is not found");
			}

			return product;
		} catch (error) {
			logger.error(`${this.scope}.update: finished with error: ${error}`);
			throw error;
		}
	}

	async delete(query: object): Promise<IProduct> {
		try {
			const product = await Product.findOneAndDelete(query).select("-__v");

			if (!product) {
				logger.warn(`${this.scope}.delete failed to findOneAndDelete`);
				throw new AppError(404, "Product is not found");
			}

			return product;
		} catch (error) {
			logger.error(`${this.scope}.delete: finished with error: ${error}`);
			throw error;
		}
	}

	async deleteMany(query: Object): Promise<Object> {
		try {
			return await Product.deleteMany(query);
		} catch (error) {
			logger.error(`${this.scope}.delete: finished with error: ${error}`);
			throw error;
		}
	}

	async pageNumber(query: Object): Promise<number> {
		try {
			return Product.countDocuments(query);
		} catch (error) {
			logger.error(`${this.scope}.find: finished with error: ${error}`);
			throw error;
		}
	}

	async aggregate(queries: Object[]): Promise<any[]> {
		try {
			return await Product.aggregate(queries);
		} catch (error) {
			logger.error(`${this.scope}.delete: finished with error: ${error}`);
			throw error;
		}
	}
}
