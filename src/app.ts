import express, { Request, Response } from "express";
import cors from "cors";
import http from "http";
import https from "https";
import { readFileSync } from "fs";
import { Server } from "socket.io";
import routes from "./routes/index";
import { expressLogger } from "./config/logger";
import { ErrorController } from "./controllers/error";
import config from "./config/config";

const app = express();
let server: any;

if (config.NodeEnv === "development") {
	const credentials = {
		key: readFileSync("/etc/letsencrypt/live/backend.birzoom.uz/privkey.pem", "utf8"),
		cert: readFileSync("/etc/letsencrypt/live/backend.birzoom.uz/cert.pem", "utf8"),
		ca: readFileSync("/etc/letsencrypt/live/backend.birzoom.uz/chain.pem", "utf8")
	};
	server = https.createServer(credentials, app);

	server = https.createServer(credentials, app);
} else {
	server = http.createServer(app);
}

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(expressLogger());

app.use(routes);

app.get("/status", (req: Request, res: Response) => {
	res.json({
		stauts: "OK"
	});
});

const errorController = new ErrorController();
app.use(errorController.hanle);

export const io = new Server(server);
io.on("connection", () => {
	console.log("a user is connected");
});

export default server;
