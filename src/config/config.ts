import dotenv from "dotenv";

dotenv.config();

interface Config {
	HttpPort: string;
	MongoHost: string;
	MongoPort: number;
	MongoDatabase: string;
	MongoPassword: string;
	MongoUser: string;
	MongoAuthDisable: boolean;
	NodeEnv: string;
	JwtSecret: string;
	MongoUrl: string;
}

const config: Config = {
	HttpPort: getConf("HTTP_PORT", "3000"),
	MongoHost: getConf("MONGO_HOST", "localhost"),
	MongoPort: parseInt(getConf("MONGO_PORT", "27017")),
	MongoDatabase: getConf("MONGO_DATABASE", "tmk_project"),
	MongoPassword: getConf("MONGO_PASSWORD", "rounded-super-pwd"),
	MongoUser: getConf("MONGO_USER", "rounded"),
	MongoUrl: getConf("MONGO_URL", "mongodb://localhost:27217/AravaGent"),
	NodeEnv: getConf("NODE_ENV", "development"),
	JwtSecret: getConf("JwtSecret", "JwtSecret"),
	MongoAuthDisable: true
};

function getConf(name: string, def: string = ""): string {
	if (process.env[name]) {
		return process.env[name] || "";
	}

	return def;
}

export default config;
