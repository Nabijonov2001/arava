import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IOTP extends Document {
	_id: string;
	phone_number: number;
	code: number;
	created_at: number;
}

const otpSchema: Schema<IOTP> = new Schema({
	_id: {
		type: String,
		default: uuidv4
	},
	phone_number: {
		type: Number,
		required: true,
		unique: true
	},
	code: {
		type: Number,
		required: true
	},
	created_at: {
		type: Date,
		default: Date.now
	}
});
otpSchema.index({ created_at: 1 }, { expireAfterSeconds: 180 });

export default mongoose.model<IOTP>("OTP", otpSchema);
