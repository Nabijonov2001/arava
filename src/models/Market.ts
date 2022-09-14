import { model, Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { IAddress } from "./Address";

export interface IMarket extends Document {
	_id: string;
	name: string;
	agents_count: number;
	products_count: number;
	shops_count: number;
	address_id: string | IAddress;
}

const marketSchema = new Schema({
	_id: {
		type: String,
		default: uuidv4
	},
	name: {
		type: String,
		required: true
	},
	agents_count: Number,
	products_count: Number,
	shops_count: Number,
	address_id: {
		type: String,
		ref: "Address",
		required: true
	}
});

marketSchema.index({ address_id: 1 });

export default model<IMarket>("Market", marketSchema);
