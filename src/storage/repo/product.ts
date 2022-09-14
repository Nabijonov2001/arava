import { IProduct } from "../../models/Product";

export interface IProductAllResponse {
	payloads: IProduct[];
	count: number;
}

export interface ProductRepo {
	find(query: Object, page?: number, role?: string): Promise<IProduct[]>;
	findOne(query: Object, key?: string): Promise<IProduct>;
	create(payload: IProduct): Promise<IProduct>;
	update(query: Object, payload: IProduct | Object): Promise<IProduct>;
	delete(query: Object): Promise<IProduct>;
	deleteMany(query: Object): Promise<Object>;
	pageNumber(query: Object): Promise<number>;
	aggregate(queries: Object[]): Promise<any[]>;
}
