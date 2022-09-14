import { IAgent } from "../../models/Agent";

export interface IAgentAllResponse {
	payloads: IAgent[];
	count: number;
}

export interface AgentRepo {
	find(query: Object, page?: number, key?: string): Promise<IAgent[]>;
	findOne(query: Object): Promise<IAgent>;
	create(payload: IAgent): Promise<IAgent>;
	update(query: Object, payload: IAgent | Object): Promise<IAgent>;
	delete(query: Object): Promise<IAgent>;
	pageNumber(query: Object): Promise<number>;
	aggregate(queries: Object[]): Promise<any[]>;
}
