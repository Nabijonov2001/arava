import { model, Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IUnit extends Document {
	_id: string;
	category_id: string;
	name: string;
	short_name: string;
}

const unitSchema = new Schema({
	_id: {
		type: String,
		default: uuidv4
	},
	category_ids: [
		{
			type: String,
			ref: "Category",
			required: true
		}
	],
	name: {
		type: String,
		required: true
	},
	short_name: {
		type: String,
		required: true
	}
});

export default model<IUnit>("Unit", unitSchema);
