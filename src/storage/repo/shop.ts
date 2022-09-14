import { IShop } from "../../models/Shop";

export interface IShopAllResponse {
	payloads: IShop[];
	count: number;
}

export interface ShopRepo {
	find(query: Object, page: number): Promise<IShop[]>;
	findOne(query: Object): Promise<IShop>;
	create(payload: IShop): Promise<IShop>;
	update(query: Object, payload: IShop | Object): Promise<IShop>;
	delete(query: Object): Promise<IShop>;
	deleteMany(query: Object): Promise<Object>;
	pageNumber(query: Object): Promise<number>;
}
