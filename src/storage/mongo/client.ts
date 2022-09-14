import { ClientRepo } from "../repo/client";
import Client, { IClient } from "../../models/Client";
import { logger } from "../../config/logger";
import AppError from "../../utils/appError";

export class ClientStorage implements ClientRepo {
	private scope = "storage.client";

	async find(query: Object, page: number, key?: string): Promise<IClient[]> {
		try {
			if (key === "password")
				return await Client.find(query)
					.limit(20)
					.skip(page * 20)
					.select("-__v");
			else
				return await Client.find(query)
					.limit(20)
					.skip(page * 20)
					.select("-__v -password");
		} catch (error) {
			logger.error(`${this.scope}.find: finished with error: ${error}`);
			throw error;
		}
	}

	async findOne(query: Object): Promise<IClient> {
		try {
			const client = await Client.findOne(query)
				.populate("address_id", "name")
				.select("-__v -password");

			if (!client) {
				logger.warn(`${this.scope}.get failed to findOne`);
				throw new AppError(404, "Client is not found");
			}

			return client;
		} catch (error) {
			logger.error(`${this.scope}.findOne: finished with error: ${error}`);
			throw error;
		}
	}

	async create(payload: IClient): Promise<IClient> {
		try {
			return await Client.create(payload);
		} catch (error) {
			logger.error(`${this.scope}.create: finished with error: ${error}`);
			throw error;
		}
	}

	async update(query: object, payload: IClient): Promise<IClient> {
		try {
			const client = await Client.findOneAndUpdate(query, payload, { new: true }).select(
				"-__v -password"
			);

			if (!client) {
				logger.warn(`${this.scope}.update failed to findOneAndUpdate`);
				throw new AppError(404, "Client is not found");
			}

			return client;
		} catch (error) {
			logger.error(`${this.scope}.update: finished with error: ${error}`);
			throw error;
		}
	}

	async delete(query: object): Promise<IClient> {
		try {
			const client = await Client.findOneAndDelete(query).select("-__v -password");

			if (!client) {
				logger.warn(`${this.scope}.delete failed to findOneAndDelete`);
				throw new AppError(404, "Client is not found");
			}

			return client;
		} catch (error) {
			logger.error(`${this.scope}.delete: finished with error: ${error}`);
			throw error;
		}
	}

	async pageNumber(query: Object): Promise<number> {
		try {
			return Client.countDocuments(query);
		} catch (error) {
			logger.error(`${this.scope}.find: finished with error: ${error}`);
			throw error;
		}
	}
}
