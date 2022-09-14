import { ChatRepo } from "../repo/chat";
import Chat, { IChat } from "../../models/Chat";
import { logger } from "../../config/logger";
import AppError from "../../utils/appError";

export class ChatStorage implements ChatRepo {
	private scope = "storage.chat";

	async find(query: Object): Promise<IChat[]> {
		try {
			return await Chat.find(query).select("-__v");
		} catch (error) {
			logger.error(`${this.scope}.find: finished with error: ${error}`);
			throw error;
		}
	}

	async findOne(query: Object): Promise<IChat> {
		try {
			const chat = await Chat.findOne(query).select("-__v");

			if (!chat) {
				logger.warn(`${this.scope}.get failed to findOne`);
				throw new AppError(404, "Chat is not found");
			}

			return chat;
		} catch (error) {
			logger.error(`${this.scope}.findOne: finished with error: ${error}`);
			throw error;
		}
	}

	async create(payload: IChat): Promise<IChat> {
		try {
			return await Chat.create(payload);
		} catch (error) {
			logger.error(`${this.scope}.create: finished with error: ${error}`);
			throw error;
		}
	}

	async update(query: Object, payload: IChat): Promise<IChat> {
		try {
			const chat = await Chat.findOneAndUpdate(query, payload, { new: true }).select("-__v");

			if (!chat) {
				logger.warn(`${this.scope}.update failed to findOneAndUpdate`);
				throw new AppError(404, "Chat is not found");
			}

			return chat;
		} catch (error) {
			logger.error(`${this.scope}.update: finished with error: ${error}`);
			throw error;
		}
	}

	async delete(query: Object): Promise<IChat> {
		try {
			const chat = await Chat.findOneAndDelete(query).select("-__v");

			if (!chat) {
				logger.warn(`${this.scope}.delete failed to findOneAndDelete`);
				throw new AppError(404, "Chat is not found");
			}

			return chat;
		} catch (error) {
			logger.error(`${this.scope}.delete: finished with error: ${error}`);
			throw error;
		}
	}
}
