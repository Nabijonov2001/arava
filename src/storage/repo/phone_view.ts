import { IPhone_view } from "../../models/Phone_view";

export interface IPhone_viewAllResponse {
	payloads: IPhone_view[];
	count: number;
}

export interface Phone_viewRepo {
	find(query: Object): Promise<IPhone_view[]>;
	findOne(query: Object): Promise<IPhone_view>;
	create(payload: IPhone_view): Promise<IPhone_view>;
	deleteMany(query: Object): Promise<Object>;
	aggregate(queries: Object[]): Promise<Object[]>;
}
