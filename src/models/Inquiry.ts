import { Document, Schema, model } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { IProduct } from "./Product";

export interface IInquiry extends Document {
	_id: string;
	from: string;
	to: string;
	read: boolean;
	product: string | IProduct;
	sub_products: {
		sub_product: string;
		quantity: number;
	}[];
	description: string;
}

const inquirySchema = new Schema(
	{
		_id: {
			type: String,
			default: uuidv4
		},
		from: {
			type: String,
			ref: "Client",
			required: true
		},
		to: {
			type: String,
			ref: "Agent",
			required: true
		},
		read: {
			type: Boolean,
			default: false
		},
		product: {
			type: String,
			ref: "Product",
			required: true
		},
		sub_products: [
			{
				sub_product: {
					type: String,
					required: true
				},
				quantity: {
					type: Number,
					required: true
				}
			}
		],
		description: String
	},
	{ timestamps: true }
);

export default model<IInquiry>("Inquiry", inquirySchema);
