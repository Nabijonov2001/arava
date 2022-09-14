import { model, Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { IAgent } from "./Agent";

export interface IProduct extends Document {
	_id: string;
	name: string;
	agent_id: string | IAgent;
	category_id: string;
	sup_category_id: string;
	image: string;
	unit: string;
	public: boolean;
	properties: {
		images: string[];
		product_count: number;
		prices: {
			price: string;
			is_hidden: boolean;
			currency: string;
			value: number;
		}[];
		models: {
			propertie: string;
			value: string;
		}[];
	}[];
	description: string;
	product_all_count: number;
	recommended: boolean;
	star_count: number;
	rating_star: number;
	views: number;
	favorites: number;
	phone_views: number;
	status: string;
}

const productSchema = new Schema(
	{
		_id: {
			type: String,
			default: uuidv4
		},
		name: {
			type: String,
			required: true
		},
		agent_id: {
			type: String,
			ref: "Agent",
			required: true
		},
		category_id: {
			type: String,
			required: true,
			ref: "Category"
		},
		sup_category_id: {
			type: String,
			required: true,
			ref: "Category"
		},
		image: String,
		unit: {
			type: String,
			ref: "Unit"
		},
		public: {
			type: Boolean,
			default: true
		},
		properties: [
			{
				images: [String],
				product_count: Number,
				prices: [
					{
						price: String,
						is_hidden: Boolean,
						currency: String,
						value: Number
					}
				],
				models: [
					{
						propertie: String,
						value: String
					}
				]
			}
		],
		description: {
			type: String
		},
		product_all_count: Number,
		recommended: Boolean,
		star_count: Number,
		rating_star: Number,
		views: Number,
		favorites: Number,
		phone_views: Number,
		status: {
			type: String,
			enum: ["active", "inactive", "blocked", "deleted"],
			default: "inactive"
		}
	},
	{ timestamps: true }
);

productSchema.index({ name: 1, description: 1, category_id: 1, status: 1 }, { name: "GetAll" });

productSchema.index({ name: 1, description: 1, sup_category_id: 1, status: 1 });

productSchema.index({ name: 1, description: 1, category_id: 1, status: 1 });

productSchema.index({ name: 1, description: 1, status: 1, agent_id: 1 });

productSchema.index({ name: 1, description: 1, status: 1 });

export default model<IProduct>("Product", productSchema);
