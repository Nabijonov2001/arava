import { OTPRepo } from "../repo/otp";
import OTP, { IOTP } from "../../models/OTP";
import { logger } from "../../config/logger";

export class OTPStorage implements OTPRepo {
	private scope = "storage.otp";

	async create(payload: IOTP): Promise<IOTP> {
		try {
			return await OTP.create(payload);
		} catch (error) {
			logger.error(`${this.scope}.create: finished with error: ${error}`);
			throw error;
		}
	}

	async findOne(query: Object): Promise<IOTP> {
		try {
			return (await OTP.find(query).select("-__v"))[0];
		} catch (error) {
			logger.error(`${this.scope}.findOne: finished with error: ${error}`);
			throw error;
		}
	}
}
