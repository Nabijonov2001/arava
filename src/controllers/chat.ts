import path from "path";
import { v4 as uuidv4 } from "uuid";
import { writeFile, unlink } from "fs/promises";
import { Request, Response, NextFunction } from "express";
import catchAsync from "../utils/catchAsync";
import { storage } from "../storage/main";
import AppError from "../utils/appError";
import { io } from "../app";
import { IChat } from "../models/Chat";

export class ChatController {
	getOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { id, role, user: admin } = res.locals;

		if (role === "admin")
			if (admin.status !== "super_admin")
				if (!admin.role?.chat?.get)
					return next(new AppError(401, "Sizni bunday vakolatingiz yoq!"));

		const _id = req.params.id;
		let chat1, chat2;

		if (role === "admin") {
			chat1 = await storage.chat.find({ from_who: "admin", to_id: _id });
			chat2 = await storage.chat.find({ from_id: _id, to_who: "admin" });
		} else {
			chat1 = await storage.chat.find({ from_id: id, to_id: _id });
			chat2 = await storage.chat.find({ from_id: _id, to_id: id });
		}

		res.status(200).json({
			success: true,
			data: {
				chat1,
				chat2
			}
		});
	});

	create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { id, role, user: admin } = res.locals;

		if (role === "admin")
			if (admin.status !== "super_admin")
				if (!admin.role?.chat?.create)
					return next(new AppError(401, "Sizni bunday vakolatingiz yoq!"));

		const { type, content, to_id, to_who } = req.body;

		if (type !== "text" || type !== "location")
			if (!req.files?.length) return next(new AppError(401, "Iltimos rasm yuklang"));
			else {
				let images = [];
				for (const image of req.files as Express.Multer.File[]) {
					const image_path = `images/${image.fieldname}-${uuidv4()}${path.extname(
						image.originalname
					)}`;
					await writeFile(
						path.join(__dirname, "../../../uploads", image_path),
						image.buffer
					);
					images.push(image_path);
				}
				content.images = images;
			}

		if (role === to_who) {
			return next(new AppError(400, "Siz faqat admin va mijozga xabar yubora olasiz"));
		}

		const chat = await storage.chat.create({
			...req.body,
			from_id: id,
			from_who: role,
			content
		});

		if (role === "admin") {
			io.emit(`admin${to_id}`, chat);
		} else if (role === "agent") {
			if (to_who === "admin") {
				io.emit(`admin${id}`, chat);
			} else if (to_who === "client") {
				io.emit(`${id}${to_id}`, chat);
			}
		} else {
			if (to_who === "admin") {
				io.emit(`admin${id}`, chat);
			} else if (to_who === "agent") {
				io.emit(`${to_id}${id}`, chat);
			}
		}

		res.status(201).json({
			success: true,
			data: {
				chat
			}
		});
	});

	update = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { chat_ids } = req.body,
			{ role } = res.locals;

		for (const _id of chat_ids) {
			const chat = await storage.chat.update({ _id }, { read: true } as IChat);

			if (role === "admin") {
				io.emit(`admin${chat.to_id}`, chat);
			} else if (role === "agent") {
				if (chat.to_who === "admin") {
					io.emit(`admin${chat.from_id}`, chat);
				} else if (chat.to_who === "client") {
					io.emit(`${chat.from_id}${chat.to_id}`, chat);
				}
			} else {
				if (chat.to_who === "admin") {
					io.emit(`admin${chat.from_id}`, chat);
				} else if (chat.to_who === "agent") {
					io.emit(`${chat.to_id}${chat.from_id}`, chat);
				}
			}
		}
	});
}
