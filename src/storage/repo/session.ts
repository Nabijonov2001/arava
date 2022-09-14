import { ISession } from "../../models/Session";

export interface ISessionAllResponse {
	payloads: ISession[];
	count: number;
}

export interface SessionRepo {
	find(query: Object): Promise<ISession[]>;
	findOne(query: Object): Promise<ISession>;
	create(payload: ISession): Promise<ISession>;
	delete(query: Object): Promise<ISession>;
	deleteMany(query: Object): Promise<Object>;
}
