import { ComplaintRepo, IComplaintAllResponse } from "../repo/complaint";
import Complaint, { IComplaint } from "../../models/Complaint";
import { logger } from "../../config/logger";
import AppError from "../../utils/appError";

export class ComplaintStorage implements ComplaintRepo {
	private scope = "storage.complaint";

	async find(query: Object): Promise<IComplaint[]> {
		try {
			return await Complaint.find(query)
				.populate([
					{ path: "client_id", select: "first_name last_name image" },
					{ path: "admin_id", select: "first_name last_name image" }
				])
				.select("-__v -product_id");
		} catch (error) {
			logger.error(`${this.scope}.find: finished with error: ${error}`);
			throw error;
		}
	}

	async findOne(query: Object): Promise<IComplaint> {
		try {
			return (await Complaint.findOne(query)
				.populate([
					{
						path: "product_id",
						select: "name rating_star image",
						populate: {
							path: "agent_id",
							select: "first_name last_name image product_count"
						}
					},
					{
						path: "client_id",
						select: "first_name last_name image"
					},
					{
						path: "admin_id",
						select: "first_name last_name image"
					}
				])
				.select("-__v")) as IComplaint;
		} catch (error) {
			logger.error(`${this.scope}.findOne: finished with error: ${error}`);
			throw error;
		}
	}

	async create(payload: IComplaint): Promise<IComplaint> {
		try {
			return await Complaint.create(payload);
		} catch (error) {
			logger.error(`${this.scope}.create: finished with error: ${error}`);
			throw error;
		}
	}

	async update(query: Object, payload: IComplaint): Promise<IComplaint> {
		try {
			const complaint = await Complaint.findOneAndUpdate(query, payload, { new: true })
				.populate([
					{
						path: "product_id",
						select: "name rating_star image",
						populate: {
							path: "agent_id",
							select: "first_name last_name image product_count"
						}
					},
					{
						path: "client_id",
						select: "first_name last_name image"
					},
					{
						path: "admin_id",
						select: "first_name last_name image"
					}
				])
				.select("-__v");

			if (!complaint) {
				logger.warn(`${this.scope}.get failed to findOne`);
				throw new AppError(404, "Complaint is not found");
			}

			return complaint;
		} catch (error) {
			logger.error(`${this.scope}.findOneAndUpdate: finished with error: ${error}`);
			throw error;
		}
	}

	async deleteMany(query: Object): Promise<Object> {
		try {
			return await Complaint.deleteMany(query).select("-__v");
		} catch (error) {
			logger.error(`${this.scope}.delete: finished with error: ${error}`);
			throw error;
		}
	}
}
