import { IChart } from "../../models/Chart";

export interface IChartAllResponse {
	payloads: IChart[];
	count: number;
}

export interface ChartRepo {
	find(query: Object): Promise<IChart[]>;
	findOne(query: Object): Promise<IChart>;
	create(payload: IChart): Promise<IChart>;
}
