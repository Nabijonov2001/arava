import { IMarket } from "../../models/Market";

export interface IMarketAllResponse {
	payloads: IMarket[];
	count: number;
}

export interface MarketRepo {
	find(query: Object): Promise<IMarket[]>;
	findOne(query: Object): Promise<IMarket>;
	create(payload: IMarket): Promise<IMarket>;
	update(query: Object, payload: IMarket | Object): Promise<IMarket>;
	delete(query: Object): Promise<IMarket>;
}
