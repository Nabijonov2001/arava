import { INotification } from "../../models/Notification";

export interface INotificationAllResponse {
	payloads: INotification[];
	count: number;
}

export interface NotificationRepo {
	find(query: Object): Promise<INotification[]>;
	findOne(query: Object): Promise<INotification>;
	create(payload: INotification): Promise<INotification>;
}
