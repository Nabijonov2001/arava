import { model, Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IAdmin extends Document {
	_id: string;
	first_name: string;
	last_name: string;
	image: string;
	profession: string;
	phone_number: number;
	password: string;
	status: string;
	role: {
		[key: string]: {
			get?: boolean;
			create?: boolean;
			update?: boolean;
			delete?: boolean;
		};
	};
}

const adminSchema = new Schema(
	{
		_id: {
			type: String,
			default: uuidv4
		},
		first_name: {
			type: String,
			required: true
		},
		last_name: {
			type: String,
			required: true
		},
		image: {
			type: String,
			default: ""
		},
		profession: String,
		phone_number: {
			type: Number,
			required: true
		},
		password: {
			type: String,
			required: true
		},
		status: {
			type: String,
			enum: ["admin", "super_admin"],
			default: "admin"
		},
		role: Object
	},
	{ timestamps: true }
);

adminSchema.index({ phone_number: 1 }, { unique: true });

export default model<IAdmin>("Admin", adminSchema);
