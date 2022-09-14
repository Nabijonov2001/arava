import { AgentRepo } from "../repo/agent";
import Agent, { IAgent } from "../../models/Agent";
import { logger } from "../../config/logger";
import AppError from "../../utils/appError";

export class AgentStorage implements AgentRepo {
	private scope = "storage.agent";

	async find(query: Object, page?: number, key?: string): Promise<IAgent[]> {
		try {
			if (key === "password") {
				if (typeof page == "number") {
					return await Agent.find(query)
						.limit(20)
						.skip(page * 20)
						.select("-__v");
				} else return await Agent.find(query);
			} else {
				if (typeof page == "number")
					return await Agent.find(query)
						.limit(20)
						.skip(page * 20)
						.select("-interests -gender -password -instagram -suggested_id")
						.populate("address_id", "name")
						.sort({ createdAt: -1 });
				else return await Agent.find(query);
			}
		} catch (error) {
			logger.error(`${this.scope}.find: finished with error: ${error}`);
			throw error;
		}
	}

	async findOne(query: Object): Promise<IAgent> {
		try {
			const agent = await Agent.findOne(query)
				.populate("address_id", "name")
				.select("-__v -password -instagram");

			if (!agent) {
				logger.warn(`${this.scope}.get failed to findOne`);
				throw new AppError(404, "Agent is not found");
			}

			return agent;
		} catch (error) {
			logger.error(`${this.scope}.findOne: finished with error: ${error}`);
			throw error;
		}
	}

	async create(payload: IAgent): Promise<IAgent> {
		try {
			return await Agent.create(payload);
		} catch (error) {
			logger.error(`${this.scope}.create: finished with error: ${error}`);
			throw error;
		}
	}

	async update(query: Object, payload: IAgent | Object): Promise<IAgent> {
		try {
			const agent = await Agent.findOneAndUpdate(query, payload, { new: true }).select(
				"-__v -password -instagram"
			);

			if (!agent) {
				logger.warn(`${this.scope}.update failed to findOneAndUpdate`);
				throw new AppError(404, "Agent is not found");
			}

			return agent;
		} catch (error) {
			logger.error(`${this.scope}.update: finished with error: ${error}`);
			throw error;
		}
	}

	async delete(query: Object): Promise<IAgent> {
		try {
			const agent = await Agent.findOneAndDelete(query).select("-__v -password -instagram");

			if (!agent) {
				logger.warn(`${this.scope}.delete failed to findOneAndDelete`);
				throw new AppError(404, "Agent is not found");
			}

			return agent;
		} catch (error) {
			logger.error(`${this.scope}.delete: finished with error: ${error}`);
			throw error;
		}
	}

	async pageNumber(query: Object): Promise<number> {
		try {
			return Agent.countDocuments(query);
		} catch (error) {
			logger.error(`${this.scope}.find: finished with error: ${error}`);
			throw error;
		}
	}

	async aggregate(queries: Object[]): Promise<any[]> {
		try {
			return await Agent.aggregate(queries);
		} catch (error) {
			logger.error(`${this.scope}.delete: finished with error: ${error}`);
			throw error;
		}
	}
}
