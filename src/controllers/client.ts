import _ from "lodash";
import path from "path";
import sharp from "sharp";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { unlink } from "fs/promises";
import { NextFunction, Request, Response } from "express";
import { signToken } from "../middleware/auth";
import catchAsync from "../utils/catchAsync";
import { storage } from "../storage/main";
import AppError from "../utils/appError";
import { IClient } from "../models/Client";
import { IChart } from "../models/Chart";
import { IDemand } from "../models/Demand";

export class ClientController {
	getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { role, user: admin } = res.locals;

		if (role === "admin")
			if (admin.status !== "super_admin")
				if (!admin.role?.client?.get)
					return next(new AppError(401, "Sizni bunday vakolatingiz yoq!"));

		const { page, search, status } = req.query as { [key: string]: string };
		delete req.query.page;
		delete req.query.search;

		const clients = await storage.client.find(
				{
					...req.query,
					status: status ? status : { $ne: "deleted" },
					$or: [
						{ first_name: { $regex: search.trim(), $options: "i" } },
						{ last_name: { $regex: search.trim(), $options: "i" } }
					]
				},
				page ? Number(page) - 1 : 0
			),
			pages = await storage.client.pageNumber({
				...req.query,
				status: status ? status : { $ne: "deleted" },
				$or: [
					{ first_name: { $regex: search.trim(), $options: "i" } },
					{ last_name: { $regex: search.trim(), $options: "i" } }
				]
			});

		res.status(200).json({
			success: true,
			data: {
				clients,
				pages: Math.ceil(pages / 20)
			}
		});
	});

	getOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { id, role, user: admin } = res.locals,
			_id = req.params.id;

		if (role === "admin")
			if (admin.status !== "super_admin")
				if (!admin.role?.client?.get)
					return next(new AppError(401, "Sizni bunday vakolatingiz yoq!"));

		if (role === "client" && id !== _id) {
			return next(new AppError(401, `Siz faqat o'zingizni malumotlaringizni ololasiz`));
		}

		const client = await storage.client.findOne({ _id });

		res.status(200).json({
			success: true,
			data: {
				client
			}
		});
	});

	create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { id } = res.locals,
			{ password, phone_number } = req.body;

		if (phone_number != id)
			return next(
				new AppError(
					400,
					"Siz kiritgan telefon raqam bilan tastiqlangan raqam bir biriga mos emas, Iltimos tekshirib qaytagan urinim ko`ring"
				)
			);

		let client = (await storage.client.find({ phone_number }, 0))[0];

		if (client) return next(new AppError(400, "Telefon raqam qaytarilmas bo`lishi kerak"));

		let image;
		if (req.file) {
			image = `images/${req.file.fieldname}-${uuidv4()}.png`;
			sharp(req.file.buffer)
				.resize({ width: 500 })
				.png()
				.toFile(path.join(__dirname, "../../../uploads", image));
		}

		let hashPassword = await bcrypt.genSalt();
		hashPassword = await bcrypt.hash(password, hashPassword);

		client = await storage.client.create({
			...req.body,
			image,
			password: hashPassword
		});

		const chart = await storage.chart.findOne({
			type: "Client",
			created_at: { $regex: new Date().toISOString().split("T").shift(), $options: "i" }
		});

		if (chart) {
			chart.count++;
			await chart.save();
		} else {
			await storage.chart.create({ type: "Client", count: 1 } as IChart);
		}

		const token = await signToken(client._id, "client");

		res.status(201).json({
			success: true,
			data: {
				token,
				client: _.pick(client, [
					"_id",
					"image",
					"first_name",
					"last_name",
					"phone_number",
					"gender",
					"telegram_username"
				])
			}
		});
	});

	login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { phone_number, password } = req.body;

		const client = (await storage.client.find({ phone_number }, 0, "password"))[0];

		if (!client)
			return next(
				new AppError(
					401,
					`Telefon raqam yoki parol noto'g'ri iltimos tekshirib qaytadan urinib ko'ring!`
				)
			);

		const check_password = await bcrypt.compare(password, client.password);

		if (!check_password)
			return next(
				new AppError(
					401,
					`Telefon raqam yoki parol noto'g'ri iltimos tekshirib qaytadan urinib ko'ring!`
				)
			);

		const token = await signToken(client._id, "client");

		res.status(201).json({
			success: true,
			data: {
				token,
				client: _.pick(client, [
					"_id",
					"interests",
					"image",
					"first_name",
					"last_name",
					"phone_number",
					"gender",
					"telegram_username"
				])
			}
		});
	});

	update = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { id } = res.locals,
			_id = req.params.id;

		if (id !== _id) {
			return next(
				new AppError(401, `Siz faqat o'zingizni malumotlaringizni o'zgartira olasiz`)
			);
		}

		const { password, new_password, image } = req.body;

		let client = (await storage.client.find({ _id }, 0, "password"))[0];

		if (new_password) {
			const check_password = await bcrypt.compare(password, client.password);

			if (!check_password)
				return next(
					new AppError(401, `Parol no'to'g'ri iltomos tekshirib qaytadan urinib ko'ring!`)
				);

			const salt = await bcrypt.genSalt();
			const hashPassword = await bcrypt.hash(new_password, salt);
			client.password = hashPassword;
		}

		if (!image) {
			if (client.image) {
				await unlink(path.join(__dirname, "../../../uploads", client.image));
				client.image = "";
			}
		}

		if (req.file) {
			const image_path = `images/${req.file.fieldname}-${uuidv4()}`;
			sharp(req.file.buffer)
				.resize({ width: 500 })
				.png()
				.toFile(path.join(__dirname, "../../../uploads", `${image_path}.png`));

			if (client.image) await unlink(path.join(__dirname, "../../../uploads", client.image));

			client.image = `${image_path}.png`;
		}

		client = await storage.client.update(
			{ _id },
			{
				...req.body,
				image: client.image,
				password: client.password
			}
		);

		res.status(200).json({
			success: true,
			data: {
				client
			}
		});
	});

	changePhoneNumber = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { id } = res.locals,
			_id = req.params.id;

		const client = await storage.client.update({ _id }, { phone_number: id } as IClient);

		res.status(200).json({
			success: true,
			data: {
				client
			}
		});
	});

	forgetPassword = catchAsync(async (req: Request, res: Response) => {
		const { id } = res.locals,
			{ password } = req.body;

		let hashPassword = await bcrypt.genSalt();
		hashPassword = await bcrypt.hash(password, hashPassword);

		const client = await storage.client.update({ phone_number: id }, {
			password: hashPassword
		} as IClient);

		const token = await signToken(client._id, "client");

		res.status(201).json({
			success: true,
			data: {
				token,
				client
			}
		});
	});

	delete = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { id, role, user: admin } = res.locals,
			{ status } = req.query,
			_id = req.params.id;

		if (role === "admin")
			if (admin.status !== "super_admin")
				if (!admin.role?.client?.delete)
					return next(new AppError(401, "Sizni bunday vakolatingiz yoq!"));

		if (id !== _id && role !== "admin") {
			return next(new AppError(401, `Siz faqat o'zingizni hisobingizni o'chira olasiz`));
		}

		const client = await storage.client.update({ _id }, { status: "deleted" } as IClient);

		const demands = await storage.demand.find({ client_id: _id });

		for (const demand of demands)
			await storage.demand.update({ _id: demand._id }, { status: "deleted" } as IDemand);

		if (role === "admin" && admin.status === "super_admin" && status === "delete") {
			await storage.client.delete({ _id });
			if (client.image) {
				await unlink(path.join(__dirname, "../../../uploads", client.image));
			}

			for (const demand of demands) {
				if (demand.images)
					for (const image of demand.images)
						await unlink(path.join(__dirname, "../../../uploads", image));

				await storage.demand.delete({ _id: demand._id });
			}
		}

		await storage.favourite.deleteMany({ client_id: _id });
		await storage.phone_view.deleteMany({ client_id: _id });
		await storage.comment.deleteMany({ from_id: _id });
		await storage.rating.deleteMany({ client_id: _id });
		await storage.complaint.deleteMany({ client_id: _id });
		await storage.inquiry.deleteMany({ from: _id });

		res.status(200).json({ success: true });
	});
}
