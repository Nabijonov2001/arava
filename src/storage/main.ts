import { AddressStorage } from "./mongo/address";
import { UnitStorage } from "./mongo/unit";
import { AdminStorage } from "./mongo/admin";
import { AgentStorage } from "./mongo/agent";
import { CategoryStorage } from "./mongo/category";
import { ClientStorage } from "./mongo/client";
import { OTPStorage } from "./mongo/otp";
import { ProductStorage } from "./mongo/product";
import { SampleStorage } from "./mongo/sample";
import { ShopStorage } from "./mongo/shop";
import { MarketStorage } from "./mongo/market";
import { DemandStorage } from "./mongo/demand";
import { FavouriteStorage } from "./mongo/favourite";
import { RatingStorage } from "./mongo/rating";
import { CommentStorage } from "./mongo/comment";
import { ChatStorage } from "./mongo/chat";
import { Dynamic_modelStorage } from "./mongo/dynamic_model";
import { Phone_viewStorage } from "./mongo/phone_view";
import { Dynamic_roleStorage } from "./mongo/dynamic_role";
import { ComplaintStorage } from "./mongo/complaint";
import { BannerStorage } from "./mongo/banner";
import { InvitedStorage } from "./mongo/invited";
import { NotificationStorage } from "./mongo/notification";
import { ChartStorage } from "./mongo/chart";
import { PricesStorage } from "./mongo/prices";
import { Product_pricesStorage } from "./mongo/product_prices";
import { SessionStorage } from "./mongo/session";
import { InquiryStorage } from "./mongo/inquiry";

interface IStorage {
	sample: SampleStorage;
	admin: AdminStorage;
	otp: OTPStorage;
	address: AddressStorage;
	unit: UnitStorage;
	agent: AgentStorage;
	category: CategoryStorage;
	client: ClientStorage;
	shop: ShopStorage;
	product: ProductStorage;
	market: MarketStorage;
	demand: DemandStorage;
	favourite: FavouriteStorage;
	rating: RatingStorage;
	comment: CommentStorage;
	chat: ChatStorage;
	dynamic_model: Dynamic_modelStorage;
	phone_view: Phone_viewStorage;
	dynamic_role: Dynamic_roleStorage;
	complaint: ComplaintStorage;
	banner: BannerStorage;
	invited: InvitedStorage;
	chart: ChartStorage;
	notification: NotificationStorage;
	prices: PricesStorage;
	product_prices: Product_pricesStorage;
	session: SessionStorage;
	inquiry: InquiryStorage;
}

export const storage: IStorage = {
	sample: new SampleStorage(),
	admin: new AdminStorage(),
	otp: new OTPStorage(),
	address: new AddressStorage(),
	unit: new UnitStorage(),
	agent: new AgentStorage(),
	category: new CategoryStorage(),
	client: new ClientStorage(),
	shop: new ShopStorage(),
	product: new ProductStorage(),
	market: new MarketStorage(),
	demand: new DemandStorage(),
	favourite: new FavouriteStorage(),
	rating: new RatingStorage(),
	comment: new CommentStorage(),
	chat: new ChatStorage(),
	dynamic_model: new Dynamic_modelStorage(),
	phone_view: new Phone_viewStorage(),
	dynamic_role: new Dynamic_roleStorage(),
	complaint: new ComplaintStorage(),
	banner: new BannerStorage(),
	invited: new InvitedStorage(),
	chart: new ChartStorage(),
	notification: new NotificationStorage(),
	prices: new PricesStorage(),
	product_prices: new Product_pricesStorage(),
	session: new SessionStorage(),
	inquiry: new InquiryStorage()
};
