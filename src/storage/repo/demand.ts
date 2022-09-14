import { IDemand } from "../../models/Demand";

export interface IDemandAllResponse {
	payloads: IDemand[];
	count: number;
}

export interface DemandRepo {
	find(query: Object, page: number, role: string): Promise<IDemand[]>;
	findOne(query: Object): Promise<IDemand>;
	create(payload: IDemand): Promise<IDemand>;
	update(query: Object, payload: IDemand): Promise<IDemand>;
	delete(query: Object): Promise<IDemand>;
	deleteMany(query: Object): Promise<Object>;
	pageNumber(query: Object): Promise<number>;
	aggregate(queries: Object[]): Promise<Object[]>;
}
