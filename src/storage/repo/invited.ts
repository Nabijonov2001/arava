import { IInvited } from "../../models/Invited";

export interface IInvitedAllResponse {
	payloads: IInvited[];
	count: number;
}

export interface InvitedRepo {
	find(query: Object, page: number): Promise<IInvited[]>;
	findOne(query: Object): Promise<IInvited>;
	create(payload: IInvited): Promise<IInvited>;
	update(query: Object, payload: IInvited): Promise<IInvited>;
	delete(query: Object): Promise<IInvited>;
	deleteMany(query: Object): Promise<Object>;
	pageNumber(query: Object): Promise<number>;
}
