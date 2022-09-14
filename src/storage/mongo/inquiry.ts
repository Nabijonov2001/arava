import { InquiryRepo, IInquiryAllResponse } from "../repo/inquiry";
import Inquiry, { IInquiry } from "../../models/Inquiry";
import { logger } from "../../config/logger";
import AppError from "../../utils/appError";

export class InquiryStorage implements InquiryRepo {
	private scope = "storage.inquiry";

	async find(query: Object): Promise<IInquiry[]> {
		try {
			return await Inquiry.find(query)
				.populate([
					{
						path: "to",
						select: "first_name last_name image"
					},
					{
						path: "from",
						select: "first_name last_name image"
					},
					{
						path: "product",
						select: "name"
					}
				])
				.select("-__v");
		} catch (error) {
			logger.error(`${this.scope}.find: finished with error: ${error}`);
			throw error;
		}
	}

	async findOne(query: Object): Promise<IInquiry> {
		try {
			const inquiry = await Inquiry.findOne(query)
				.populate([
					{
						path: "to",
						select: "first_name last_name image phone_number telegram_username"
					},
					{
						path: "from",
						select: "first_name last_name image phone_number telegram_username"
					},
					{
						path: "product",
						populate: {
							path: "unit",
							select: "short_name"
						}
					}
				])
				.select("-__v");

			if (!inquiry) {
				logger.warn(`${this.scope}.get failed to findOne`);
				throw new AppError(404, "Inquiry is not found");
			}

			return inquiry;
		} catch (error) {
			logger.error(`${this.scope}.findOne: finished with error: ${error}`);
			throw error;
		}
	}

	async create(payload: IInquiry): Promise<IInquiry> {
		try {
			return await Inquiry.create(payload);
		} catch (error) {
			logger.error(`${this.scope}.create: finished with error: ${error}`);
			throw error;
		}
	}

	async delete(query: object): Promise<IInquiry> {
		try {
			const inquiry = await Inquiry.findOneAndDelete(query).select("-__v");

			if (!inquiry) {
				logger.warn(`${this.scope}.delete failed to findOneAndDelete`);
				throw new AppError(404, "Inquiry is not found");
			}

			return inquiry;
		} catch (error) {
			logger.error(`${this.scope}.delete: finished with error: ${error}`);
			throw error;
		}
	}

	async deleteMany(query: Object): Promise<Object> {
		try {
			return await Inquiry.deleteMany(query).select("-__v");
		} catch (error) {
			logger.error(`${this.scope}.delete: finished with error: ${error}`);
			throw error;
		}
	}

	async count(query: Object): Promise<number> {
		try {
			return Inquiry.countDocuments(query);
		} catch (error) {
			logger.error(`${this.scope}.find: finished with error: ${error}`);
			throw error;
		}
	}
}
