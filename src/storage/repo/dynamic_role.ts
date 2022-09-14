import { IDynamic_role } from "../../models/Dynamic_role";

export interface IDynamic_roleAllResponse {
	payloads: IDynamic_role[];
	count: number;
}

export interface Dynamic_roleRepo {
	find(query: Object): Promise<IDynamic_role[]>;
	findOne(query: Object): Promise<IDynamic_role>;
	create(payload: IDynamic_role): Promise<IDynamic_role>;
	update(query: Object, payload: IDynamic_role): Promise<IDynamic_role>;
	delete(query: Object): Promise<IDynamic_role>;
}
