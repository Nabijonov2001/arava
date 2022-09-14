import { model, Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IAgent extends Document {
	_id: string;
	first_name: string;
	last_name: string;
	interests: string[];
	address_id: string;
	telegram_username: string;
	gender: string;
	phone_number: number;
	image: string;
	password: string;
	description: string;
	instagram: {
		username: string;
		password: string;
	};
	suggested_id: string;
	product_count: number;
	rating: number;
	star_count: number;
	rating_star: number;
	status: string;
}

const agentSchema = new Schema(
	{
		_id: {
			type: String,
			default: uuidv4
		},
		interests: [String],
		address_id: {
			type: String,
			ref: "Address"
		},
		first_name: {
			type: String,
			required: true
		},
		last_name: {
			type: String
		},
		telegram_username: String,
		gender: {
			type: String,
			enum: ["male", "female"]
		},
		image: {
			type: String
		},
		phone_number: {
			type: Number,
			required: true
		},
		password: {
			type: String
		},
		description: String,
		instagram: {
			username: String,
			password: String
		},
		suggested_id: String,
		product_count: Number,
		rating: Number,
		star_count: Number,
		rating_star: Number,
		status: {
			type: String,
			enum: ["active", "inactive", "blocked", "pending", "no_activated", "deleted"],
			default: "pending"
		}
	},
	{ timestamps: true }
);

agentSchema.index({ phone_number: 1 }, { unique: true });

export default model<IAgent>("Agent", agentSchema);
