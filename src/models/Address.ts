import { model, Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IAddress extends Document {
	_id: string;
	name: string;
}

const addressSchema = new Schema(
	{
		_id: {
			type: String,
			default: uuidv4
		},
		name: {
			type: String,
			required: true
		}
	},
	{
		timestamps: true
	}
);

export default model<IAddress>("Address", addressSchema);
