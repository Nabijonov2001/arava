import { Api, TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";
import { Request, Response, NextFunction } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
import { storage } from "../storage/main";

const apiId = 16233997;
const apiHash = "7e8f7fe35488b3921b09d1e540a623d2";
const stringSession = new StringSession(
	"1AgAOMTQ5LjE1NC4xNjcuNTEBuyUUDl3ndAPoS2l4rM2T6Q48WmXEfHK24M5wAR3Cu10V5ngT8S9DJJ8Rcp4TDuNrOQd/nzZwTUSU7uM+Y86CHsaIaWz/4gq5052uxXqX2YMlQcftGjoBUwH+0IEYW3yooPshNKSOHOYcoTM0Mcd+fJacc9IvrGxUi8v35blCUseNkvFjQIJeUqaJ6bsh8R5WtplbcEqKMIbuXem+EQKeVYRoDlIDewoK1tHf45zgrGC2VOFakT84k+xjA2L3kWwGtJq9VMfsTjL4kS0/5WcJnxowJWZVcQBx5qb3Gk9FIAAiReONzzRH1K23vvfFBB+n8RqI4hFCop8DSj9t916Yo2w="
); // fill this later with the value from session.save()

export class TelegramController {
	getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const client = new TelegramClient(stringSession, apiId, apiHash, {});
		client.connect().then(async () => {
			const result = await client.invoke(
				new Api.messages.GetHistory({
					peer: req.query.username,
					offsetId: req.query.offsetId ? req.query.offsetId : 0,
					// offsetDate: 43,
					addOffset: 0,
					limit: 100,
					maxId: 0,
					minId: 0,
					hash: 0
				} as any)
			);
			res.json({
				data: {
					result
				}
			});
		});
	});
}
