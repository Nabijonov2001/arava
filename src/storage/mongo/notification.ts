import { NotificationRepo } from "../repo/notification";
import Notification, { INotification } from "../../models/Notification";
import { logger } from "../../config/logger";
import AppError from "../../utils/appError";

export class NotificationStorage implements NotificationRepo {
	private scope = "storage.notification";

	async find(query: Object): Promise<INotification[]> {
		try {
			return await Notification.find(query).select("-__v");
		} catch (error) {
			logger.error(`${this.scope}.find: finished with error: ${error}`);
			throw error;
		}
	}

	async findOne(query: Object): Promise<INotification> {
		try {
			const notification = await Notification.findOne(query).select("-__v");

			if (!notification) {
				logger.warn(`${this.scope}.get failed to findOne`);
				throw new AppError(404, "Notification is not found");
			}

			return notification;
		} catch (error) {
			logger.error(`${this.scope}.findOne: finished with error: ${error}`);
			throw error;
		}
	}

	async create(payload: INotification): Promise<INotification> {
		try {
			return await Notification.create(payload);
		} catch (error) {
			logger.error(`${this.scope}.create: finished with error: ${error}`);
			throw error;
		}
	}
}

