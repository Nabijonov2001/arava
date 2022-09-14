import { model, Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface ICategory extends Document {
	_id: string;
	name: string;
	visible: string;
	icon_svg: string;
	icon_png: string;
	sup_category_id: string | ICategory;
	category_count: number;
	product_count: number;
	status: string;
	views: number;
}

const categorySchema = new Schema(
	{
		_id: {
			type: String,
			default: uuidv4
		},
		name: {
			type: String,
			unique: true,
			required: true
		},
		visible: {
			type: Boolean,
			default: true
		},
		icon_svg: {
			type: String
		},
		icon_png: {
			type: String
		},
		sup_category_id: {
			type: String,
			ref: "Category",
			default: null
		},
		category_count: Number,
		product_count: {
			type: Number,
			default: 0
		},
		views: Number,
		status: {
			type: String,
			unum: ["active", "deleted"],
			default: "active"
		}
	},
	{
		timestamps: true
	}
);

export default model<ICategory>("Category", categorySchema);
