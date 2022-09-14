import { IFavourite } from "../../models/Favourite";

export interface IFavouriteAllResponse {
	payloads: IFavourite[];
	count: number;
}

export interface FavouriteRepo {
	find(query: Object): Promise<IFavourite[]>;
	findOne(query: Object): Promise<IFavourite>;
	create(payload: IFavourite): Promise<IFavourite>;
	delete(query: Object): Promise<IFavourite>;
	deleteMany(query: Object): Promise<Object>;
	pageNumber(query: Object): Promise<number>;
	aggregate(queries: Object[]): Promise<Object[]>;
}
