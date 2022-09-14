import { Document, model, Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface INotification extends Document {
	_id: string;
	from_who: string;
	to_who: string;
	message: string;
}

const notificationSchema = new Schema(
	{
		_id: {
			type: String,
			default: uuidv4
		},
		from_who: String,
		to_who: String,
		message: {
			type: String,
			required: true
		}
	},
	{ timestamps: true }
);

export default model<INotification>("Notification", notificationSchema);
