import { model, Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IFavourite extends Document {
	_id: string;
	user: string;
	user_id: string;
	type: string;
	type_id: string;
	category_id: string;
}

const favouriteSchema = new Schema(
	{
		_id: {
			type: String,
			default: uuidv4
		},
		user: {
			type: String,
			enum: ["Client", "Agent"],
			required: true
		},
		user_id: {
			type: String,
			refPath: "user",
			required: true
		},
		type: {
			type: String,
			enum: ["Product", "Agent", "Category", "Demand"],
			required: true
		},
		type_id: {
			type: String,
			refPath: "type",
			required: true
		},
		category_id: String
	},
	{ timestamps: true }
);
7;
favouriteSchema.index({ user_id: 1, type: 1 });
7;
favouriteSchema.index({ user_id: 1, type_id: 1 }, { unique: true });

export default model<IFavourite>("Favourite", favouriteSchema);
