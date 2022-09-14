import { Document, model, Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { IProduct } from "./Product";

export interface IComment extends Document {
	_id: string;
	product_id: string | IProduct;
	from_who: string;
	from_id: string;
	message: string;
}

const commentSchema = new Schema(
	{
		_id: {
			type: String,
			default: uuidv4
		},
		product_id: {
			type: String,
			ref: "Product"
		},
		from_who: {
			type: String
		},
		from_id: {
			type: String
		},
		message: {
			type: String
		}
	},
	{ timestamps: true }
);

export default model<IComment>("Comment", commentSchema);
