import { IPrices } from "../../models/Prices";

export interface IPricesAllResponse {
	payloads: IPrices[];
	count: number;
}

export interface PricesRepo {
	find(query: Object): Promise<IPrices[]>;
	findOne(query: Object): Promise<IPrices>;
	create(payload: IPrices): Promise<IPrices>;
	insertMany(payload: IPrices): Promise<IPrices>;
	update(query: Object, payload: IPrices): Promise<IPrices>;
	delete(query: Object): Promise<IPrices>;
}
