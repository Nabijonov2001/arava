import { IComplaint } from "../../models/Complaint";

export interface IComplaintAllResponse {
	payloads: IComplaint[];
	count: number;
}

export interface ComplaintRepo {
	find(query: Object): Promise<IComplaint[]>;
	findOne(query: Object): Promise<IComplaint>;
	create(payload: IComplaint): Promise<IComplaint>;
	update(query: Object, payload: IComplaint): Promise<IComplaint>;
	deleteMany(query: Object): Promise<Object>;
}
