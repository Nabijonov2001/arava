import { model, Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IPrices extends Document {
	_id: string;
	category_id: string;
	required: boolean;
	name: string;
	currency: string;
}

const prices = new Schema({
	_id: {
		type: String,
		default: uuidv4
	},
	category_id: {
		type: String,
		required: true
	},
	required: Boolean,
	name: {
		type: String,
		required: true
	}
});

export default model<IPrices>("Prices", prices);
