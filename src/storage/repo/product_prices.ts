import { IProduct_prices } from "../../models/Product_prices";

export interface IProduct_pricesAllResponse {
	payloads: IProduct_prices[];
	count: number;
}

export interface Product_pricesRepo {
	find(query: Object): Promise<IProduct_prices[]>;
	findOne(query: Object): Promise<IProduct_prices>;
	create(payload: IProduct_prices): Promise<IProduct_prices>;
	update(query: Object, payload: IProduct_prices): Promise<IProduct_prices>;
	delete(query: Object): Promise<IProduct_prices>;
	deleteMany(query: Object): Promise<Object>;
}
