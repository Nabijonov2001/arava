import { AdminRepo } from "../repo/admin";
import Admin, { IAdmin } from "../../models/Admin";
import { logger } from "../../config/logger";
import AppError from "../../utils/appError";

export class AdminStorage implements AdminRepo {
	private scope = "storage.admin";

	async find(query: Object, key?: string): Promise<IAdmin[]> {
		try {
			if (key === "password") return await Admin.find(query).select("-__v -role");
			else if (key === "role") return await Admin.find(query).select("-__v -password");
			else return await Admin.find(query).select("-__v -password -role");
		} catch (error) {
			logger.error(`${this.scope}.find: finished with error: ${error}`);
			throw error;
		}
	}

	async findOne(query: Object, key?: string): Promise<IAdmin> {
		try {
			const admin = await Admin.findOne(query).select("-__v -password");

			if (!admin) {
				logger.warn(`${this.scope}.get failed to findOne`);
				throw new AppError(404, "Admin is not found");
			}

			return admin;
		} catch (error) {
			logger.error(`${this.scope}.findOne: finished with error: ${error}`);
			throw error;
		}
	}

	async create(payload: IAdmin): Promise<IAdmin> {
		try {
			return await Admin.create(payload);
		} catch (error) {
			logger.error(`${this.scope}.create: finished with error: ${error}`);
			throw error;
		}
	}

	async update(query: object, payload: IAdmin): Promise<IAdmin> {
		try {
			const admin = await Admin.findOneAndUpdate(query, payload, { new: true }).select(
				"-__v -password"
			);

			if (!admin) {
				logger.warn(`${this.scope}.update failed to findOneAndUpdate`);
				throw new AppError(404, "Admin is not found");
			}

			return admin;
		} catch (error) {
			logger.error(`${this.scope}.update: finished with error: ${error}`);
			throw error;
		}
	}

	async delete(query: object): Promise<IAdmin> {
		try {
			const admin = await Admin.findOneAndDelete(query).select("-__v -password");

			if (!admin) {
				logger.warn(`${this.scope}.delete failed to findOneAndDelete`);
				throw new AppError(404, "Admin is not found");
			}

			return admin;
		} catch (error) {
			logger.error(`${this.scope}.delete: finished with error: ${error}`);
			throw error;
		}
	}
}
