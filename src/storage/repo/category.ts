import { ICategory } from "../../models/Category";

export interface ICategoryAllResponse {
	payloads: ICategory[];
	count: number;
}

export interface CategoryRepo {
	find(query: Object, page: number): Promise<ICategory[]>;
	findOne(query: Object): Promise<ICategory>;
	create(payload: ICategory): Promise<ICategory>;
	update(query: Object, payload: ICategory | Object): Promise<ICategory>;
	delete(query: Object): Promise<ICategory>;
	pageNumber(query: Object): Promise<number>;
	aggregate(queries: Object[]): Promise<any[]>;
}
