import { model, Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IBanner extends Document {
	_id: string;
	above: boolean;
	below: boolean;
	description: string;
	image: string;
	expiration_date: number;
	status: string;
}

const bannerSchema = new Schema(
	{
		_id: {
			type: String,
			default: uuidv4
		},
		above: Boolean,
		below: Boolean,
		description: {
			type: String,
			required: true
		},
		image: {
			type: String,
			required: true
		},
		expiration_date: {
			type: Number,
			required: true
		},
		status: {
			type: String,
			enum: ["visible", "hidden"],
			default: "visible"
		}
	},
	{ timestamps: true }
);

export default model<IBanner>("Banner", bannerSchema);
