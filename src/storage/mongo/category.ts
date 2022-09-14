import { CategoryRepo } from "../repo/category";
import Category, { ICategory } from "../../models/Category";
import { logger } from "../../config/logger";
import AppError from "../../utils/appError";

export class CategoryStorage implements CategoryRepo {
	private scope = "storage.category";

	async find(query: Object, page: number): Promise<ICategory[]> {
		try {
			return await Category.find(query)
				.limit(20)
				.skip(page * 20)
				.sort({ createdAt: -1 })
				.select("-__v");
		} catch (error) {
			logger.error(`${this.scope}.find: finished with error: ${error}`);
			throw error;
		}
	}

	async findOne(query: Object): Promise<ICategory> {
		try {
			const category = await Category.findOne(query)
				.populate("sup_category_id", "name")
				.select("-__v");

			if (!category) {
				logger.warn(`${this.scope}.get failed to findOne`);
				throw new AppError(404, "Category is not found");
			}

			return category;
		} catch (error) {
			logger.error(`${this.scope}.findOne: finished with error: ${error}`);
			throw error;
		}
	}

	async create(payload: ICategory): Promise<ICategory> {
		try {
			return await Category.create(payload);
		} catch (error) {
			logger.error(`${this.scope}.create: finished with error: ${error}`);
			throw error;
		}
	}

	async update(query: object, payload: ICategory | Object): Promise<ICategory> {
		try {
			const category = await Category.findOneAndUpdate(query, payload, { new: true })
				.populate("sup_category_id", "name")
				.select("-__v");

			if (!category) {
				logger.warn(`${this.scope}.update failed to findOneAndUpdate`);
				throw new AppError(404, "Category is not found");
			}

			return category;
		} catch (error) {
			logger.error(`${this.scope}.update: finished with error: ${error}`);
			throw error;
		}
	}

	async delete(query: object): Promise<ICategory> {
		try {
			const category = await Category.findOneAndDelete(query).select("-__v");

			if (!category) {
				logger.warn(`${this.scope}.delete failed to findOneAndDelete`);
				throw new AppError(404, "Category is not found");
			}

			return category;
		} catch (error) {
			logger.error(`${this.scope}.delete: finished with error: ${error}`);
			throw error;
		}
	}

	async pageNumber(query: Object): Promise<number> {
		try {
			return Category.countDocuments(query);
		} catch (error) {
			logger.error(`${this.scope}.find: finished with error: ${error}`);
			throw error;
		}
	}

	async aggregate(queries: Object[]): Promise<any[]> {
		try {
			return await Category.aggregate(queries);
		} catch (error) {
			logger.error(`${this.scope}.delete: finished with error: ${error}`);
			throw error;
		}
	}
}
