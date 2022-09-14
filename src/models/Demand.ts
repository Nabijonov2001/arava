import { model, Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IDemand extends Document {
	_id: string;
	client_id: string;
	address: string;
	read: boolean;
	product_name: string;
	category_id: string;
	quantity: number;
	unit: string;
	price: number;
	expire_at: string;
	description: string;
	images: string[];
	status: string;
}

const demandSchema = new Schema(
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
		address: {
			type: String,
			ref: "Address",
			required: true
		},
		read: {
			type: Boolean,
			default: false
		},
		product_name: {
			type: String,
			required: true
		},
		category_id: {
			type: String,
			ref: "Category",
			required: true
		},
		quantity: {
			type: Number,
			required: true
		},
		unit: {
			type: String,
			required: true,
			ref: "Unit"
		},
		price: Number,
		expire_at: {
			type: String,
			required: true
		},
		description: String,
		images: [String],
		status: {
			type: String,
			enum: ["active", "inactive", "blocked", "expired", "deleted"],
			default: "inactive"
		}
	},
	{ timestamps: true }
);

demandSchema.index({ product_name: 1, description: 1, status: 1 });
demandSchema.index({ product_name: 1, description: 1, client_id: 1, status: 1 });
demandSchema.index({ product_name: 1, description: 1, category_id: 1, status: 1 });

export default model<IDemand>("Demand", demandSchema);
