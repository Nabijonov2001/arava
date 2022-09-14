import { Dynamic_roleRepo } from "../repo/dynamic_role";
import Dynamic_role, { IDynamic_role } from "../../models/Dynamic_role";
import { logger } from "../../config/logger";
import AppError from "../../utils/appError";

export class Dynamic_roleStorage implements Dynamic_roleRepo {
	private scope = "storage.dynamic_role";

	async find(query: Object): Promise<IDynamic_role[]> {
		try {
			return await Dynamic_role.find(query).select("-__v");
		} catch (error) {
			logger.error(`${this.scope}.find: finished with error: ${error}`);
			throw error;
		}
	}

	async findOne(query: Object): Promise<IDynamic_role> {
		try {
			const dynamic_role = await Dynamic_role.findOne(query).select("-__v");

			if (!dynamic_role) {
				logger.warn(`${this.scope}.get failed to findOne`);
				throw new AppError(404, "Dynamic role is not found");
			}

			return dynamic_role;
		} catch (error) {
			logger.error(`${this.scope}.findOne: finished with error: ${error}`);
			throw error;
		}
	}

	async create(payload: IDynamic_role): Promise<IDynamic_role> {
		try {
			return await Dynamic_role.create(payload);
		} catch (error) {
			logger.error(`${this.scope}.create: finished with error: ${error}`);
			throw error;
		}
	}

	async update(query: object, payload: IDynamic_role): Promise<IDynamic_role> {
		try {
			const dynamic_role = await Dynamic_role.findOneAndUpdate(query, payload, {
				new: true
			}).select("-__v");

			if (!dynamic_role) {
				logger.warn(`${this.scope}.update failed to findOneAndUpdate`);
				throw new AppError(404, "Dynamic role is not found");
			}

			return dynamic_role;
		} catch (error) {
			logger.error(`${this.scope}.update: finished with error: ${error}`);
			throw error;
		}
	}

	async delete(query: object): Promise<IDynamic_role> {
		try {
			const dynamic_role = await Dynamic_role.findOneAndDelete(query).select("-__v");

			if (!dynamic_role) {
				logger.warn(`${this.scope}.delete failed to findOneAndDelete`);
				throw new AppError(404, "Dynamic role is not found");
			}

			return dynamic_role;
		} catch (error) {
			logger.error(`${this.scope}.delete: finished with error: ${error}`);
			throw error;
		}
	}
}
