import { IInquiry } from "../../models/Inquiry";

export interface IInquiryAllResponse {
	payloads: IInquiry[];
	count: number;
}

export interface InquiryRepo {
	find(query: Object): Promise<IInquiry[]>;
	findOne(query: Object): Promise<IInquiry>;
	create(payload: IInquiry): Promise<IInquiry>;
	delete(query: Object): Promise<IInquiry>;
	deleteMany(query: Object): Promise<Object>;
	count(query: Object): Promise<number>;
}
