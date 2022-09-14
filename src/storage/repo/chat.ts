import { IChat } from "../../models/Chat";

export interface IChatAllResponse {
	payloads: IChat[];
	count: number;
}

export interface ChatRepo {
	find(query: Object): Promise<IChat[]>;
	findOne(query: Object): Promise<IChat>;
	create(payload: IChat): Promise<IChat>;
	update(query: Object, payload: IChat): Promise<IChat>;
	delete(query: Object): Promise<IChat>;
}
