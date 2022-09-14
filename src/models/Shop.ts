import { model, Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { IAddress } from "./Address";
import { IAgent } from "./Agent";

export interface IShop extends Document {
	_id: string;
	name: string;
	agent_id: string | IAgent;
	address_id: string | IAddress;
	market_id: string;
	product_quantity: number;
	image: string;
	description: string;
}

const shopSchema = new Schema({
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
	address_id: {
		type: String,
		ref: "Address",
		required: true
	},
	market_id: {
		type: String,
		required: true
	},
	product_quantity: {
		type: Number,
		default: 0
	},
	image: {
		type: String
	},
	description: {
		type: String
	}
});

shopSchema.index({ agent_id: 1 });
shopSchema.index({ market_id: 1 });

export default model<IShop>("Shop", shopSchema)
