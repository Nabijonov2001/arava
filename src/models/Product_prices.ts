import { model, Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IProduct_prices extends Document {
	_id: string;
	product_id: string;
	is_hidden: boolean;
	required: boolean;
	name: string;
	currency: string;
}

const product_pricesSchema = new Schema({
	_id: {
		type: String,
		default: uuidv4
	},
	product_id: {
		type: String,
		required: true
	},
	is_hidden: Boolean,
	required: Boolean,
	name: {
		type: String,
		required: true
	},
	currency: {
		type: String,
		enum: ["USD", "UZS"],
		required: true
	}
});

export default model<IProduct_prices>("Product_prices", product_pricesSchema);
