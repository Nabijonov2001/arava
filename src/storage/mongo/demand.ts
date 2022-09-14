import { DemandRepo, IDemandAllResponse } from "../repo/demand";
import Demand, { IDemand } from "../../models/Demand";
import { logger } from "../../config/logger";
import AppError from "../../utils/appError";

export class DemandStorage implements DemandRepo {
	private scope = "storage.demand";

	async find(query: Object, page?: number, role?: string): Promise<IDemand[]> {
		try {
			if (typeof page === "number")
				if (role === "admin")
					return await Demand.find(query)
						.limit(20)
						.skip(page * 20)
						.sort({ createdAt: -1 })
						.select("product_name images description read createdAt")
						.populate([
							{
								path: "client_id",
								select: "first_name last_name"
							},
							{ path: "category_id", select: "name" }
						]);
				else
					return await Demand.find(query)
						.limit(20)
						.skip(page * 20)
						.sort({ createdAt: -1 })
						.select("product_name images description createdAt")
						.populate([
							{
								path: "client_id",
								select: "phone_number telegram_username -_id"
							},
							{ path: "address", select: "name -_id" }
						]);
			else return await Demand.find(query).select("images");
		} catch (error) {
			logger.error(`${this.scope}.find: finished with error: ${error}`);
			throw error;
		}
	}

	async findOne(query: Object): Promise<IDemand> {
		try {
			const demand = await Demand.findOne(query)
				.populate([
					{
						path: "client_id",
						select: "first_name last_name phone_number telegram_username"
					},
					{
						path: "unit",
						select: "name -_id"
					},
					{
						path: "address",
						select: "name -_id"
					},
					{
						path: "category_id",
						select: "name -_id"
					}
				])
				.select("-__v");

			if (!demand) {
				logger.warn(`${this.scope}.get failed to findOne`);
				throw new AppError(404, "Demand is not found");
			}

			return demand;
		} catch (error) {
			logger.error(`${this.scope}.findOne: finished with error: ${error}`);
			throw error;
		}
	}

	async create(payload: IDemand): Promise<IDemand> {
		try {
			return await Demand.create(payload);
		} catch (error) {
			logger.error(`${this.scope}.create: finished with error: ${error}`);
			throw error;
		}
	}

	async update(query: Object, payload: IDemand): Promise<IDemand> {
		try {
			const demand = await Demand.findOneAndUpdate(query, payload, { new: true })
				.populate([
					{
						path: "client_id",
						select: "first_name last_name phone_number telegram_username"
					},
					{
						path: "unit",
						select: "name -_id"
					},
					{
						path: "address",
						select: "name -_id"
					},
					{
						path: "category_id",
						select: "name -_id"
					}
				])
				.select("-__v");

			if (!demand) {
				logger.warn(`${this.scope}.update failed to findOneAndUpdate`);
				throw new AppError(404, "Demand is not found");
			}

			return demand;
		} catch (error) {
			logger.error(`${this.scope}.update: finished with error: ${error}`);
			throw error;
		}
	}

	async delete(query: Object): Promise<IDemand> {
		try {
			const demand = await Demand.findOneAndDelete(query).select("-__v");

			if (!demand) {
				logger.warn(`${this.scope}.delete failed to findOneAndDelete`);
				throw new AppError(404, "Demand is not found");
			}

			return demand;
		} catch (error) {
			logger.error(`${this.scope}.delete: finished with error: ${error}`);
			throw error;
		}
	}

	async deleteMany(query: Object): Promise<Object> {
		try {
			return await Demand.deleteMany(query).select("-__v");
		} catch (error) {
			logger.error(`${this.scope}.delete: finished with error: ${error}`);
			throw error;
		}
	}

	async pageNumber(query: Object): Promise<number> {
		try {
			return Demand.countDocuments(query);
		} catch (error) {
			logger.error(`${this.scope}.find: finished with error: ${error}`);
			throw error;
		}
	}

	async aggregate(queries: Object[]): Promise<Object[]> {
		try {
			return await Demand.aggregate(queries);
		} catch (error) {
			logger.error(`${this.scope}.delete: finished with error: ${error}`);
			throw error;
		}
	}
}
