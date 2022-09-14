import { IDynamic_model } from "../../models/Dynamic_model";

export interface IDynamic_modelAllResponse {
	payloads: IDynamic_model[];
	count: number;
}

export interface Dynamic_modelRepo {
	find(query: Object): Promise<IDynamic_model[]>;
	findOne(query: Object): Promise<IDynamic_model>;
	create(payload: IDynamic_model): Promise<IDynamic_model>;
	insertMany(payload: IDynamic_model): Promise<IDynamic_model>;
	update(query: Object, payload: IDynamic_model): Promise<IDynamic_model>;
	delete(query: Object): Promise<IDynamic_model>;
}
