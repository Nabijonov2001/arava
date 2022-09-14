import { IBanner } from "../../models/Banner";

export interface IBannerAllResponse {
	payloads: IBanner[];
	count: number;
}

export interface BannerRepo {
	find(query: Object, page: number): Promise<IBanner[]>;
	findOne(query: Object): Promise<IBanner>;
	create(payload: IBanner): Promise<IBanner>;
	update(query: Object, payload: IBanner): Promise<IBanner>;
	delete(query: Object): Promise<IBanner>;
	pageNumber(query: Object): Promise<number>;
}
