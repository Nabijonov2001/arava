import { model, Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IDynamic_model extends Document {
	_id: string;
	category_id: string;
	required: boolean;
	type: string;
	name: string;
	values?: string[];
}

const dynamic_modelSchema = new Schema({
	_id: {
		type: String,
		default: uuidv4
	},
	category_id: {
		type: String,
		required: true
	},
	required: Boolean,
	type: {
		type: String,
		enum: ["text", "selection", "numeric"],
		required: true
	},
	name: {
		type: String,
		required: true
	},
	values: [String]
});

export default model<IDynamic_model>("Dynamic_model", dynamic_modelSchema);
