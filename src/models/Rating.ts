import { model, Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IRating extends Document {
	_id: string;
	client_id: string;
	type: string;
	type_id: string;
	stars: number;
	comment: string;
}

const ratingSchema = new Schema(
	{
		_id: {
			type: String,
			default: uuidv4
		},
		client_id: {
			type: String,
			required: true,
			ref: "Client"
		},
		type: {
			type: String,
			enum: ["Agent", "Product"],
			required: true
		},
		type_id: {
			type: String,
			required: true,
			refPath: "type"
		},
		stars: {
			type: Number,
			required: true
		},
		comment: {
			type: String
		}
	},
	{ timestamps: true }
);

ratingSchema.index({ client_id: 1, type_id: 1 }, { unique: true });
ratingSchema.index({ type_id: 1 });
ratingSchema.index({ stars: 1 });
ratingSchema.index({ type_id: 1, stars: 1 });

export default model<IRating>("Rating", ratingSchema);
