import { AddressRepo } from "../repo/address";
import Address, { IAddress } from "../../models/Address";
import { logger } from "../../config/logger";
import AppError from "../../utils/appError";

export class AddressStorage implements AddressRepo {
	private scope = "storage.address";

	async find(query: Object): Promise<IAddress[]> {
		try {
			return await Address.find(query).select("-__v");
		} catch (error) {
			logger.error(`${this.scope}.find: finished with error: ${error}`);
			throw error;
		}
	}

	async findOne(query: Object): Promise<IAddress> {
		try {
			const address = await Address.findOne(query).select("-__v");

			if (!address) {
				logger.warn(`${this.scope}.get failed to findOne`);
				throw new AppError(404, "Address is not found");
			}

			return address;
		} catch (error) {
			logger.error(`${this.scope}.findOne: finished with error: ${error}`);
			throw error;
		}
	}

	async create(payload: IAddress): Promise<IAddress> {
		try {
			return await Address.create(payload);
		} catch (error) {
			logger.error(`${this.scope}.create: finished with error: ${error}`);
			throw error;
		}
	}

	async update(query: object, payload: IAddress): Promise<IAddress> {
		try {
			const address = await Address.findOneAndUpdate(query, payload, { new: true }).select(
				"-__v"
			);

			if (!address) {
				logger.warn(`${this.scope}.update failed to findOneAndUpdate`);
				throw new AppError(404, "Address is not found");
			}

			return address;
		} catch (error) {
			logger.error(`${this.scope}.update: finished with error: ${error}`);
			throw error;
		}
	}

	async delete(query: object): Promise<IAddress> {
		try {
			const address = await Address.findOneAndDelete(query).select("-__v");

			if (!address) {
				logger.warn(`${this.scope}.delete failed to findOneAndDelete`);
				throw new AppError(404, "Address is not found");
			}

			return address;
		} catch (error) {
			logger.error(`${this.scope}.delete: finished with error: ${error}`);
			throw error;
		}
	}
}
