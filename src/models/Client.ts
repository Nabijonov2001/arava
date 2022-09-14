import { model, Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IClient extends Document {
	_id: string;
	interests: string[];
	first_name: string;
	last_name: string;
	address_id: string;
	telegram_username: string;
	gender: string;
	image: string;
	phone_number: number;
	password: string;
	status: string;
}

const clientSchema = new Schema(
	{
		_id: {
			type: String,
			default: uuidv4
		},
		interests: [String],
		first_name: {
			type: String,
			required: true
		},
		last_name: {
			type: String
		},
		address_id: {
			type: String,
			ref: "Address"
		},
		image: {
			type: String
		},
		phone_number: {
			type: Number,
			required: true,
			unique: true
		},
		password: {
			type: String,
			required: true
		},
		gender: {
			type: String,
			enum: ["male", "female"]
		},
		telegram_username: String,
		status: {
			type: String,
			unum: ["active", "deleted"],
			default: "active"
		}
	},
	{ timestamps: true }
);

clientSchema.index({ phone_number: 1 }, { unique: true });

export default model<IClient>("Client", clientSchema);
