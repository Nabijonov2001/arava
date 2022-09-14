import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface ISession extends Document {
	_id: string;
	user_id: string;
	user_agent: string;
	ip_address: string;
}

const sessionSchema = new Schema(
	{
		_id: {
			type: String,
			default: uuidv4
		},
		user_id: {
			type: String,
			required: true
		},
		user_agent: {
			type: String,
			required: true
		},
		ip_address: {
			type: String,
			required: true
		}
	},
	{ timestamps: true }
);

export default mongoose.model<ISession>("Session", sessionSchema);
