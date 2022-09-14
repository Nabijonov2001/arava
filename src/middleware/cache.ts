import NodeCache from "node-cache";
import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";

// stdTTL: time to live in seconds for every generated cache element.
const cache = new NodeCache({ stdTTL: 10 * 60 });

function getUrlFromRequest(req: Request, res: Response) {
	if (req.baseUrl === "/v1/product") return res.locals.role + req.originalUrl;
	else if (req.baseUrl === "/v1/demand")
		if (res.locals.role === "admin") return res.locals.role + req.originalUrl;
		else return res.locals.id + req.originalUrl;
	return req.originalUrl;
}

export const set = (key?: string) => {
	return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		if (key) {
			cache.set(key, res.locals.data);
			return next();
		}

		const url = getUrlFromRequest(req, res);

		cache.set(url, res.locals.data);

		return next();
	});
};

export const get = (key?: string) => {
	return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		if (key) {
			const content = cache.get(key);

			if (content) {
				return res.status(200).send(content);
			}

			return next();
		}

		const url = getUrlFromRequest(req, res);
		const content = cache.get(url);

		if (content) {
			return res.status(200).send(content);
		}

		return next();
	});
};

export const clear = (keys?: string[]) => {
	return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const keys = cache.keys();

		if (keys.length) {
			for (const key of keys) cache.del(keys.filter((k) => k.includes(key)));
			return next();
		}

		if (keys.length) {
			cache.del(keys.filter((k) => k.includes(req.baseUrl)));
		}

		return next();
	});
};
