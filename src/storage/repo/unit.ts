import { IUnit } from "../../models/Unit";

export interface IUnitAllResponse {
	payloads: IUnit[];
	count: number;
}

export interface UnitRepo {
	find(query: Object): Promise<IUnit[]>;
	findOne(query: Object): Promise<IUnit>;
	create(payload: IUnit): Promise<IUnit>;
	update(query: Object, payload: IUnit): Promise<IUnit>;
	delete(query: Object): Promise<IUnit>;
	deleteMany(query: object): Promise<Object>;
}
