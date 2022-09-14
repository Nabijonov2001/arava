import { IAddress } from "../../models/Address";

export interface IAddressAllResponse {
	payloads: IAddress[];
	count: number;
}

export interface AddressRepo {
	find(query: Object): Promise<IAddress[]>;
	findOne(query: Object): Promise<IAddress>;
	create(payload: IAddress): Promise<IAddress>;
	update(query: object, payload: IAddress): Promise<IAddress>;
	delete(query: object): Promise<IAddress>;
}
