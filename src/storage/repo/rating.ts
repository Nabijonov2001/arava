import { IRating } from "../../models/Rating";

export interface IRatingAllResponse {
	payloads: IRating[];
	count: number;
}

export interface RatingRepo {
	find(query: Object, page?: number): Promise<IRating[]>;
	findOne(query: Object): Promise<IRating>;
	create(payload: IRating): Promise<IRating>;
	deleteMany(query: Object): Promise<Object>;
	pageNumber(query: Object): Promise<number>;
}
