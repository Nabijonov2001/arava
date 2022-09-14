import { NextFunction, Request, Response } from "express";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";
import jwt from "jsonwebtoken";
import config from "../config/config";
import { storage } from "../storage/main";

type DecodedToken = {
	id: string;
	role: string;
	iat: number;
};

export const signToken = async (id: string, role: string): Promise<string> => {
	return jwt.sign({ id, role }, config.JwtSecret);
};

export const decodeToken = async (token: string): Promise<DecodedToken> => {
	return jwt.verify(token, config.JwtSecret) as DecodedToken;
};

export const authMiddleware = (roles: string[]) => {
	return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const token = req.headers.authorization;

		if (!token) {
			return next(new AppError(401, "Iltimos tizimga kiring"));
		}

		const decoded = decodeToken(token);
		const role = (await decoded).role;

		if ((!roles.includes("all") || role === "otp") && !roles.includes(role)) {
			return next(new AppError(401, "Sizga ruxsat berilmagan"));
		}

		if (role === "agent") {
			const agent = await storage.agent.findOne({ _id: (await decoded).id });

			if (agent.status !== "active" && req.baseUrl === "/v1/chart") {
				return next(
					new AppError(
						400,
						"Hozirda sizni adminlar ko`rib chiqishyabdi tez orada sizni foallashtirishadi!"
					)
				);
			}
		}

		if (role === "admin") {
			const user = (await storage[role].find({ _id: (await decoded).id }, "role"))[0];

			if (!user) {
				return next(new AppError(400, "Iltimos ro`yxatdan o`ting"));
			}

			const session = (
				await storage.session.find({
					user_id: user._id,
					user_agent: req.headers["user-agent"]
				})
			)[0];

			if (!session)
				throw new AppError(
					401,
					"Token foydalanuvchi seansi allaqachon oʻchirib tashlanganga oʻxshaydi"
				);

			res.locals.user = user;
		} else if (role === "client" || role === "agent") {
			const user = (await storage[role].find({ _id: (await decoded).id }, 0))[0];

			if (!user) {
				return next(new AppError(400, "Iltimos ro`yxatdan o`ting"));
			}

			res.locals.user = user;
		}

		res.locals.id = (await decoded).id;
		res.locals.role = (await decoded).role;

		next();
	});
};
