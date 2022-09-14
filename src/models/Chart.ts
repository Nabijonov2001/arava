import { model, Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IChart extends Document {
	_id: string;
	user: string;
	user_id: string;
	type: string;
	type_id: string;
	count: number;
}

const chartSchema = new Schema(
	{
		_id: {
			type: String,
			default: uuidv4
		},
		user: String,
		user_id: String,
		type: {
			type: String,
			required: true
		},
		type_id: {
			type: String,
			refPath: "type"
		},
		count: Number,
		created_at: {
			type: String,
			default: new Date().toISOString()
		}
	},
	{ timestamps: true }
);

chartSchema.index({ type_id: 1, created_at: 1, user_id: 1 }, { name: "ProductFilter" });
chartSchema.index({ type: 1, created_at: 1 }, { name: "TypeAndCreated_at" });
chartSchema.index({ type: 1 });

export default model<IChart>("Charts", chartSchema);
