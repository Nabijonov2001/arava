import { IComment } from "../../models/Comment";

export interface ICommentAllResponse {
	payloads: IComment[];
	count: number;
}

export interface CommentRepo {
	find(query: Object): Promise<IComment[]>;
	findOne(query: Object): Promise<IComment>;
	create(payload: IComment): Promise<IComment>;
	deleteMany(query: Object): Promise<Object>;
}
