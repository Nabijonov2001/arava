import { Dynamic_modelRepo } from "../repo/dynamic_model";
import Dynamic_model, { IDynamic_model } from "../../models/Dynamic_model";
import { logger } from "../../config/logger";
import AppError from "../../utils/appError";

export class Dynamic_modelStorage implements Dynamic_modelRepo {
	private scope = "storage.dynamic_model";

	async find(query: Object): Promise<IDynamic_model[]> {
		try {
			return await Dynamic_model.find(query).select("-__v");
		} catch (error) {
			logger.error(`${this.scope}.find: finished with error: ${error}`);
			throw error;
		}
	}

	async findOne(query: Object): Promise<IDynamic_model> {
		try {
			const dynamic_model = await Dynamic_model.findOne(query).select("-__v");

			if (!dynamic_model) {
				logger.warn(`${this.scope}.get failed to findOne`);
				throw new AppError(404, "Dynamic model is not found");
			}

			return dynamic_model;
		} catch (error) {
			logger.error(`${this.scope}.findOne: finished with error: ${error}`);
			throw error;
		}
	}

	async create(payload: IDynamic_model): Promise<IDynamic_model> {
		try {
			return await Dynamic_model.create(payload);
		} catch (error) {
			logger.error(`${this.scope}.create: finished with error: ${error}`);
			throw error;
		}
	}

	async insertMany(payload: IDynamic_model): Promise<IDynamic_model> {
		try {
			return await Dynamic_model.insertMany(payload);
		} catch (error) {
			logger.error(`${this.scope}.create: finished with error: ${error}`);
			throw error;
		}
	}

	async update(query: object, payload: IDynamic_model): Promise<IDynamic_model> {
		try {
			const dynamic_model = await Dynamic_model.findOneAndUpdate(query, payload, {
				new: true
			}).select("-__v");

			if (!dynamic_model) {
				logger.warn(`${this.scope}.update failed to findOneAndUpdate`);
				throw new AppError(404, "Dynamic model is not found");
			}

			return dynamic_model;
		} catch (error) {
			logger.error(`${this.scope}.update: finished with error: ${error}`);
			throw error;
		}
	}

	async delete(query: object): Promise<IDynamic_model> {
		try {
			const dynamic_model = await Dynamic_model.findOneAndDelete(query).select("-__v");

			if (!dynamic_model) {
				logger.warn(`${this.scope}.delete failed to findOneAndDelete`);
				throw new AppError(404, "Dynamic model is not found");
			}

			return dynamic_model;
		} catch (error) {
			logger.error(`${this.scope}.delete: finished with error: ${error}`);
			throw error;
		}
	}
}
