import { SessionRepo } from "../repo/session";
import Session, { ISession } from "../../models/Session";
import { logger } from "../../config/logger";
import AppError from "../../utils/appError";

export class SessionStorage implements SessionRepo {
	private scope = "storage.session";

	async find(query: Object): Promise<ISession[]> {
		try {
			const sessions = await Session.find(query);

			return sessions;
		} catch (error) {
			logger.error(`${this.scope}.find: finished with error: ${error}`);
			throw error;
		}
	}

	async findOne(query: Object): Promise<ISession> {
		try {
			const session = await Session.findOne(query);

			if (!session) {
				logger.warn(`${this.scope}.get failed to findOne`);
				throw new AppError(404, "sassion_404");
			}

			return session;
		} catch (error) {
			logger.error(`${this.scope}.findOne: finished with error: ${error}`);
			throw error;
		}
	}

	async create(payload: ISession): Promise<ISession> {
		try {
			const session = await Session.create(payload);

			return session;
		} catch (error) {
			logger.error(`${this.scope}.create: finished with error: ${error}`);
			throw error;
		}
	}

	async delete(query: Object): Promise<ISession> {
		try {
			const session = await Session.findOneAndDelete(query);

			if (!session) {
				logger.warn(`${this.scope}.delete failed to findOneAndDelete`);
				throw new AppError(404, "sassion_404");
			}

			return session;
		} catch (error) {
			logger.error(`${this.scope}.delete: finished with error: ${error}`);
			throw error;
		}
	}

	async deleteMany(query: Object): Promise<Object> {
		try {
			const sessions = await Session.deleteMany(query);

			return sessions;
		} catch (error) {
			logger.error(`${this.scope}.deleteMany: finished with error: ${error}`);
			throw error;
		}
	}
}
