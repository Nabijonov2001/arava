import { UnitRepo } from "../repo/unit";
import Unit, { IUnit } from "../../models/Unit";
import { logger } from "../../config/logger";
import AppError from "../../utils/appError";

export class UnitStorage implements UnitRepo {
	private scope = "storage.unit";

	async find(query: Object): Promise<IUnit[]> {
		try {
			return await Unit.find(query).populate("category_ids", "name").select("-__v");
		} catch (error) {
			logger.error(`${this.scope}.find: finished with error: ${error}`);
			throw error;
		}
	}

	async findOne(query: Object): Promise<IUnit> {
		try {
			const unit = await Unit.findOne(query).populate("category_ids", "name").select("-__v");

			if (!unit) {
				logger.warn(`${this.scope}.get failed to findOne`);
				throw new AppError(404, "Unit is not found");
			}

			return unit;
		} catch (error) {
			logger.error(`${this.scope}.findOne: finished with error: ${error}`);
			throw error;
		}
	}

	async create(payload: IUnit): Promise<IUnit> {
		try {
			return await Unit.create(payload);
		} catch (error) {
			logger.error(`${this.scope}.create: finished with error: ${error}`);
			throw error;
		}
	}

	async update(query: Object, payload: IUnit): Promise<IUnit> {
		try {
			const unit = await Unit.findOneAndUpdate(query, payload, { new: true }).select("-__v");

			if (!unit) {
				logger.warn(`${this.scope}.update failed to findOneAndUpdate`);
				throw new AppError(404, "Unit is not found");
			}

			return unit;
		} catch (error) {
			logger.error(`${this.scope}.update: finished with error: ${error}`);
			throw error;
		}
	}

	async updateMany(query: Object, payload: Object): Promise<void> {
		try {
			await Unit.updateMany(query, payload);

			return;
		} catch (error) {
			logger.error(`${this.scope}.update: finished with error: ${error}`);
			throw error;
		}
	}

	async delete(query: Object): Promise<IUnit> {
		try {
			const unit = await Unit.findOneAndDelete(query).select("-__v");

			if (!unit) {
				logger.warn(`${this.scope}.delete failed to findOneAndDelete`);
				throw new AppError(404, "Unit is not found");
			}

			return unit;
		} catch (error) {
			logger.error(`${this.scope}.delete: finished with error: ${error}`);
			throw error;
		}
	}

	async deleteMany(query: Object): Promise<Object> {
		try {
			return await Unit.deleteMany(query);
		} catch (error) {
			logger.error(`${this.scope}.delete: finished with error: ${error}`);
			throw error;
		}
	}
}
