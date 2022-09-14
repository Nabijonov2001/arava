import { NextFunction, Request, Response } from "express";
import { storage } from "../storage/main";
// import Instagram from "instagram-web-api"
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
import { IAgent } from "../models/Agent";

export class InstagramController {
	get = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { id } = res.locals;
		// user = (await storage.agent.find({ _id: id }, 0, "password"))[0],
		//     agent: any = new Instagram({
		//         username: "foydali.link",
		//         password: "M199820"
		//     })

		// await agent.login()
		// await agent.getProfile()

		// agent.getPhotosByUsername({ username: req.query.username }).then((result: any) => {
		//     res.json({ result })
		// })

		// const instagram = await agent.getUserByUsername({ username: req.query.username })

		res.status(200).json({
			success: true,
			data: {}
		});
	});

	interation = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		// const { id } = res.locals,
		//     agent: any = new Instagram(req.body)

		// await agent.login()
		// await agent.getProfile()

		// if (agent === undefined) return next(new AppError(401, "Parol yoki username noto`g`ri"))

		// await storage.agent.update({ _id: id }, {
		//     instagram: req.body
		// } as IAgent)

		// const instagram = await agent.getUserByUsername({ username: req.body.username })

		res.status(200).json({
			success: true,
			data: {}
		});
	});
}
