import { CommentRepo } from "../repo/comment";
import Comment, { IComment } from "../../models/Comment";
import { logger } from "../../config/logger";
import AppError from "../../utils/appError";

export class CommentStorage implements CommentRepo {
	private scope = "storage.comment";

	async find(query: Object): Promise<IComment[]> {
		try {
			return await Comment.find(query).select("-__v");
		} catch (error) {
			logger.error(`${this.scope}.find: finished with error: ${error}`);
			throw error;
		}
	}

	async findOne(query: Object): Promise<IComment> {
		try {
			const comment = await Comment.findOne(query)
				.select("-__v")
				.populate("product_id", "name");

			if (!comment) {
				logger.warn(`${this.scope}.get failed to findOne`);
				throw new AppError(404, "Comment is not found");
			}

			return comment;
		} catch (error) {
			logger.error(`${this.scope}.findOne: finished with error: ${error}`);
			throw error;
		}
	}

	async create(payload: IComment): Promise<IComment> {
		try {
			return await Comment.create(payload);
		} catch (error) {
			logger.error(`${this.scope}.create: finished with error: ${error}`);
			throw error;
		}
	}

	async deleteMany(query: Object): Promise<Object> {
		try {
			return await Comment.deleteMany(query).select("-__v");
		} catch (error) {
			logger.error(`${this.scope}.delete: finished with error: ${error}`);
			throw error;
		}
	}
}
