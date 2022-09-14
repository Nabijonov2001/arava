import { IAdmin } from "../../models/Admin";

export interface IAdminAllResponse {
	payloads: IAdmin[];
	count: number;
}

export interface AdminRepo {
	find(query: Object, key?: string): Promise<IAdmin[]>;
	findOne(query: Object): Promise<IAdmin>;
	create(payload: IAdmin): Promise<IAdmin>;
	update(query: Object, payload: IAdmin): Promise<IAdmin>;
	delete(query: Object): Promise<IAdmin>;
}
