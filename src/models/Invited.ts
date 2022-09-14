import { model, Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IInvited extends Document {
	_id: string;
	type: string;
	type_id: string;
	user_type: string;
	user_id: string;
}

const invitedSchema = new Schema(
	{
		_id: {
			type: String,
			default: uuidv4
		},
		type: {
			type: String,
			enum: ["agent", "client"],
			required: true
		},
		type_id: {
			type: String,
			required: true
		},
		user_type: {
			type: String,
			enum: ["agent", "client"],
			required: true
		},
		user_id: {
			type: String,
			required: true
		}
	},
	{ timestamps: true }
);

export default model<IInvited>("Invited", invitedSchema);
