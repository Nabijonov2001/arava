import { Document, Schema, model } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IChat extends Document {
	_id: string;
	from_id: string;
	from_who: string;
	to_id: string;
	to_who: string;
	type: string;
	content: {
		text: string;
		images: string[];
		location: {
			long: number;
			lat: number;
		};
	};
	read: boolean;
}

const chatSchema = new Schema(
	{
		_id: {
			type: String,
			default: uuidv4
		},
		from_id: {
			type: String,
			required: true
		},
		from_who: {
			type: String,
			enum: ["admin", "agent", "client"],
			required: true
		},
		to_id: {
			type: String,
			required: true
		},
		to_who: {
			type: String,
			enum: ["admin", "agent", "client"],
			required: true
		},
		type: {
			type: String,
			enum: ["text", "images", "location"],
			required: true
		},
		content: {
			text: String,
			images: [String],
			location: {
				long: Number,
				lat: Number
			}
		},
		read: {
			type: Boolean,
			default: false
		}
	},
	{ timestamps: true }
);

export default model<IChat>("Chat", chatSchema);
