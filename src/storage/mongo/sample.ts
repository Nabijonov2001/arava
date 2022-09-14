import { SampleRepo } from "../repo/sample";
import Sample, { ISample } from "../../models/Sample";
import { logger } from "../../config/logger";
import AppError from "../../utils/appError";

export class SampleStorage implements SampleRepo {
	private scope = "storage.sample";

	async find(query: Object): Promise<ISample[]> {
		try {
			return await Sample.find(query).select("-__v");
		} catch (error) {
			logger.error(`${this.scope}.find: finished with error: ${error}`);
			throw error;
		}
	}

	async findOne(query: Object): Promise<ISample> {
		try {
			const sample = await Sample.findOne(query).select("-__v");

			if (!sample) {
				logger.warn(`${this.scope}.get failed to findOne`);
				throw new AppError(404, "Sample is not found");
			}

			return sample;
		} catch (error) {
			logger.error(`${this.scope}.findOne: finished with error: ${error}`);
			throw error;
		}
	}

	async create(payload: ISample): Promise<ISample> {
		try {
			return await Sample.create(payload);
		} catch (error) {
			logger.error(`${this.scope}.create: finished with error: ${error}`);
			throw error;
		}
	}

	async update(query: object, payload: ISample): Promise<ISample> {
		try {
			const sample = await Sample.findOneAndUpdate(query, payload, { new: true }).select(
				"-__v"
			);

			if (!sample) {
				logger.warn(`${this.scope}.update failed to findOneAndUpdate`);
				throw new AppError(404, "Sample is not found");
			}

			return sample;
		} catch (error) {
			logger.error(`${this.scope}.update: finished with error: ${error}`);
			throw error;
		}
	}

	async delete(query: object): Promise<ISample> {
		try {
			const sample = await Sample.findOneAndDelete(query).select("-__v");

			if (!sample) {
				logger.warn(`${this.scope}.delete failed to findOneAndDelete`);
				throw new AppError(404, "Sample is not found");
			}

			return sample;
		} catch (error) {
			logger.error(`${this.scope}.delete: finished with error: ${error}`);
			throw error;
		}
	}
}
