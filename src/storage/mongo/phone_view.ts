import { Phone_viewRepo, IPhone_viewAllResponse } from "../repo/phone_view";
import Phone_view, { IPhone_view } from "../../models/Phone_view";
import { logger } from "../../config/logger";
import AppError from "../../utils/appError";
import Comment from "../../models/Comment";

export class Phone_viewStorage implements Phone_viewRepo {
	private scope = "storage.phone_view";

	async find(query: Object): Promise<IPhone_view[]> {
		try {
			return await Phone_view.find(query).select("-__v");
		} catch (error) {
			logger.error(`${this.scope}.find: finished with error: ${error}`);
			throw error;
		}
	}

	async findOne(query: Object): Promise<IPhone_view> {
		try {
			const phone_view = await Phone_view.findOne(query)
				.populate("client_id", "first_name last_name")
				.populate("product_id", "name category_id sup_category_id price images")
				.select("-__v");

			if (!phone_view) {
				logger.warn(`${this.scope}.get failed to findOne`);
				throw new AppError(404, "Phone_view is not found");
			}

			return phone_view;
		} catch (error) {
			logger.error(`${this.scope}.findOne: finished with error: ${error}`);
			throw error;
		}
	}

	async create(payload: IPhone_view): Promise<IPhone_view> {
		try {
			return await Phone_view.create(payload);
		} catch (error) {
			logger.error(`${this.scope}.create: finished with error: ${error}`);
			throw error;
		}
	}

	async deleteMany(query: Object): Promise<Object> {
		try {
			return await Phone_view.deleteMany(query).select("-__v");
		} catch (error) {
			logger.error(`${this.scope}.delete: finished with error: ${error}`);
			throw error;
		}
	}

	async aggregate(queries: Object[]): Promise<Object[]> {
		try {
			return await Phone_view.aggregate(queries);
		} catch (error) {
			logger.error(`${this.scope}.delete: finished with error: ${error}`);
			throw error;
		}
	}
}
