import { IOTP } from "../../models/OTP";

export interface IOTPAllResponse {
	payloads: IOTP[];
	count: number;
}

export interface OTPRepo {
	create(payload: IOTP): Promise<IOTP>;
	findOne(query: Object): Promise<IOTP>;
}
