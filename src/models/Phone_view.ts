import { model, Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IPhone_view extends Document {
	_id: string;
	client_id: string;
	product_id: string;
	category_id: string;
}

const phone_viewSchema = new Schema(
	{
		_id: {
			type: String,
			default: uuidv4
		},
		client_id: {
			type: String,
			ref: "Client",
			required: true
		},
		product_id: {
			type: String,
			ref: "Product",
			required: true
		},
		category_id: String
	},
	{ timestamps: true }
);

phone_viewSchema.index({ product_id: 1 });

export default model<IPhone_view>("Phone_view", phone_viewSchema);
