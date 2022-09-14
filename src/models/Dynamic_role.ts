import { model, Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IDynamic_role extends Document {
	_id: string;
	title: string;
	trans: string;
	children: {
		title: string;
		trans: string;
		value: boolean;
	}[];
}

const dynamic_roleSchema = new Schema({
	_id: {
		type: String,
		default: uuidv4
	},
	title: {
		type: String,
		required: true
	},
	trans: {
		type: String,
		required: true
	},
	children: [
		{
			title: {
				type: String,
				enum: ["get", "create", "update", "delete"],
				required: true
			},
			trans: {
				type: String,
				enum: ["Ko'ra olish", "Yaratish", "Tahrirlash", "O'chirish"],
				required: true
			},
			value: {
				type: Boolean,
				default: false
			}
		}
	]
});

export default model<IDynamic_role>("Dynamic_role", dynamic_roleSchema);
