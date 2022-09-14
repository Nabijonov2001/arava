import { IClient } from "../../models/Client";

export interface IClientAllResponse {
	payloads: IClient[];
	count: number;
}

export interface ClientRepo {
	find(query: Object, page: number, key?: string): Promise<IClient[]>;
	findOne(query: Object): Promise<IClient>;
	create(payload: IClient): Promise<IClient>;
	update(query: Object, payload: IClient): Promise<IClient>;
	delete(query: Object): Promise<IClient>;
	pageNumber(query: Object): Promise<number>;
}
