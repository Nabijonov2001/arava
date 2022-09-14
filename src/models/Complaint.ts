import { required } from "joi";
import { model, Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { IAdmin } from "./Admin";
import { IClient } from "./Client";
import { IProduct } from "./Product";

export interface IComplaint extends Document {
	_id: string;
	type: string;
	client_id: string | IClient;
	product_id: string | IProduct;
	admin_id: string | IAdmin;
	complaint_id: string | IComplaint;
	text: string;
	read: boolean;
}

const complaintSchema = new Schema(
	{
		_id: {
			type: String,
			default: uuidv4
		},
		type: {
			type: String,
			enum: ["incoming", "outgoing"],
			required: true
		},
		client_id: {
			type: String,
			ref: "Client"
		},
		product_id: {
			type: String,
			ref: "Product"
		},
		admin_id: {
			type: String,
			ref: "Admin"
		},
		complaint_id: String,
		text: {
			type: String,
			required: true
		},
		read: {
			type: Boolean,
			default: false
		}
	},
	{ timestamps: true }
);

export default model<IComplaint>("Complaint", complaintSchema);
