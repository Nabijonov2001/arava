import _ from "lodash";
import path from "path";
import sharp from "sharp";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { unlink } from "fs/promises";
import { NextFunction, Request, Response } from "express";
import { decodeToken, signToken } from "../middleware/auth";
import catchAsync from "../utils/catchAsync";
import { storage } from "../storage/main";
import AppError from "../utils/appError";
import { IAgent } from "../models/Agent";
import { IInvited } from "../models/Invited";

export class AgentController {
	getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { role, user: admin } = res.locals;

		if (role === "admin") {
			if (admin.status !== "super_admin")
				if (!admin.role?.agent?.get)
					return next(new AppError(401, "Sizni bunday vakolatingiz yoq!"));
		}

		const { page, search, status } = req.query as { [key: string]: string };
		delete req.query.page;
		delete req.query.search;

		const agents = await storage.agent.find(
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
			pages = await storage.agent.pageNumber({
				...req.query,
				status: status ? status : { $ne: "deleted" },
				$or: [
					{ first_name: { $regex: search.trim(), $options: "i" } },
					{ last_name: { $regex: search.trim(), $options: "i" } }
				]
			});

		let count;
		if (role === "admin") count = await storage.agent.pageNumber({ status: "inactive" });

		res.locals.data = {
			success: true,
			data: {
				agents,
				pages: Math.ceil(pages / 20),
				count
			}
		};

		res.status(200).json({
			success: true,
			data: {
				agents,
				pages: Math.ceil(pages / 20),
				count
			}
		});

		next();
	});

	getOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { id, role, user: admin } = res.locals;

		if (role === "admin") {
			if (admin.status !== "super_admin")
				if (!admin.role?.agent?.get)
					return next(new AppError(401, "Sizni bunday vakolatingiz yoq!"));
		}

		const agent = await storage.agent.findOne({ _id: req.params.id });

		let token;
		if (req.query.token === "true") {
			token = await signToken(agent.id, "agent");
		}

		let user_rated;
		if (role === "client")
			user_rated = (await storage.rating.find({ client_id: id }, 0))[0]?.stars;

		res.status(200).json({
			success: true,
			data: {
				agent,
				user_rated,
				token
			}
		});
	});

	create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { id, role, user: admin } = res.locals,
			{ password, phone_number } = req.body;

		if (role === "admin") {
			if (admin?.status !== "super_admin")
				if (!admin?.role?.agent?.create)
					return next(new AppError(401, "Sizni bunday vakolatingiz yoq!"));
		}

		if (role !== "admin" && phone_number != id)
			return next(
				new AppError(
					400,
					"Siz kiritgan telefon raqam bilan tastiqlangan raqam bir biriga mos emas, Iltimos tekshirib qaytagan urinim ko`ring"
				)
			);

		let agent = (await storage.agent.find({ phone_number }, 0))[0];

		if (agent) return next(new AppError(400, "Telefon raqam qaytarilmas bo`lishi kerak"));

		let image;
		if (req.file) {
			image = `images/${req.file.fieldname}-${uuidv4()}.png`;

			sharp(req.file.buffer)
				.resize({ width: 500 })
				.png()
				.toFile(path.join(__dirname, "../../../uploads", image));
		}

		let hashPassword;
		if (password) {
			hashPassword = await bcrypt.genSalt();
			hashPassword = await bcrypt.hash(password, hashPassword);
		}

		agent = await storage.agent.create({
			...req.body,
			image: image ? image : "",
			password: hashPassword,
			status: role === "admin" ? "no_activated" : "pending"
		});

		if (req.query.token) {
			const { id, role } = await decodeToken(req.query.token as string);

			await storage.invited.create({
				type: role,
				type_id: id,
				user_type: "agent",
				user_id: agent._id
			} as IInvited);
		}

		const token = await signToken(agent._id, "agent");

		res.status(201).json({
			success: true,
			data: {
				token,
				agent: _.pick(agent, [
					"_id",
					"interests",
					"first_name",
					"last_name",
					"image",
					"gender",
					"phone_number",
					"telegram_username",
					"status"
				])
			}
		});

		next();
	});

	login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { phone_number, password } = req.body;

		const agent = (await storage.agent.find({ phone_number }, 0, "password"))[0];

		if (!agent)
			return next(
				new AppError(
					401,
					`Telefon raqam yoki parol noto'g'ri iltimos tekshirib qaytadan urinib ko'ring!`
				)
			);

		const check_password = await bcrypt.compare(password, agent.password);

		if (!check_password)
			return next(
				new AppError(
					401,
					`Telefon raqam yoki parol noto'g'ri iltimos tekshirib qaytadan urinib ko'ring!`
				)
			);

		const token = await signToken(agent._id, "agent");

		res.status(201).json({
			success: true,
			data: {
				token,
				agent: _.pick(agent, [
					"_id",
					"interests",
					"first_name",
					"last_name",
					"image",
					"gender",
					"phone_number",
					"telegram_username",
					"rating_star",
					"status"
				])
			}
		});
	});

	update = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { id, role, user: admin } = res.locals,
			_id = req.params.id;

		if (role === "admin") {
			if (admin.status !== "super_admin")
				if (!admin.role?.agent?.update)
					return next(new AppError(401, "Sizni bunday vakolatingiz yoq!"));
		}

		if (role !== "admin" && id !== _id) {
			return next(
				new AppError(401, `Siz faqat o'zingizni malumotlaringizni o'zgartira olasiz`)
			);
		}

		const { password, new_password, image } = req.body;

		let agent = (await storage.agent.find({ _id }, 0, "password"))[0];

		if (new_password) {
			const check_password = await bcrypt.compare(password, agent.password);

			if (!check_password)
				return next(
					new AppError(401, `Parol no'to'g'ri iltomos tekshirib qaytadan urinib ko'ring!`)
				);

			const salt = await bcrypt.genSalt();
			const hashPassword = await bcrypt.hash(new_password, salt);
			agent.password = hashPassword;
		}

		if (!image) {
			if (agent.image) {
				await unlink(path.join(__dirname, "../../../uploads", agent.image));
				agent.image = "";
			}
		}

		if (req.file) {
			const image_path = `images/${req.file.fieldname}-${uuidv4()}`;
			sharp(req.file.buffer)
				.resize({ width: 500 })
				.png()
				.toFile(path.join(__dirname, "../../../uploads", `${image_path}.png`));

			if (agent.image) await unlink(path.join(__dirname, "../../../uploads", agent.image));

			agent.image = `${image_path}.png`;
		}

		agent = await storage.agent.update(
			{ _id },
			{
				...req.body,
				image: agent.image,
				password: agent.password
			}
		);

		res.status(200).json({
			success: true,
			data: {
				agent
			}
		});

		next();
	});

	changePhoneNumber = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { id } = res.locals,
			_id = req.params.id;

		const agent = await storage.agent.update({ _id }, { phone_number: id } as IAgent);

		res.status(200).json({
			success: true,
			data: {
				agent
			}
		});

		next();
	});

	forgetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { id } = res.locals,
			{ password } = req.body;

		let hashPassword = await bcrypt.genSalt();
		hashPassword = await bcrypt.hash(password, hashPassword);

		const agent = await storage.agent.update({ phone_number: id }, {
			password: hashPassword
		} as IAgent);

		const token = await signToken(agent._id, "agent");

		res.status(201).json({
			success: true,
			data: {
				token,
				agent
			}
		});
	});

	delete = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { id, role, user: admin } = res.locals,
			{ status } = req.query,
			_id = req.params.id;

		if (role === "admin")
			if (admin.status !== "super_admin")
				if (!admin.role?.agent?.delete)
					return next(new AppError(401, "Sizni bunday vakolatingiz yoq!"));

		if (id !== _id && role !== "admin") {
			return next(new AppError(401, `Siz faqat o'zingizni hisobingizni o'chira olasiz`));
		}

		const agent = await storage.agent.delete({ _id });
		await storage.rating.deleteMany({ type_id: _id });

		if (agent.image) {
			await unlink(path.join(__dirname, "../../../uploads", agent.image));
		}

		const products = await storage.product.find({ agent_id: _id });

		for (const product of products) {
			const complaint = (
				await storage.comment.find({ product_id: product._id, read: false })
			)[0];

			if (complaint)
				throw new AppError(
					401,
					`Sizni mahsulotlaringizdan birini ustidan shikoyat tushgan adminlar ko'ribchiqishganidan keyin o'chira olasiz!`
				);
		}

		for (const product of products) {
			await storage.product.update({ _id: product._id }, { status: "deleted" });
		}

		await storage.rating.deleteMany({ type_id: _id });
		await storage.favourite.deleteMany({ user_id: _id });
		await storage.favourite.deleteMany({ type_id: _id });
		await storage.invited.deleteMany({ user_id: _id });
		await storage.invited.deleteMany({ type_id: _id });
		await storage.inquiry.deleteMany({ to: _id });

		if (role === "admin" && admin.status === "super_admin" && status === "delete") {
			if (agent.image) {
				await unlink(path.join(__dirname, "../../../uploads", agent.image));
			}

			for (const product of products) {
				for (const propertie of product.properties)
					if (propertie.images)
						for (const image of propertie.images)
							await unlink(path.join(__dirname, "../../../uploads", image));

				if (product.image)
					await unlink(path.join(__dirname, "../../../uploads", product.image));

				await storage.product_prices.deleteMany({ product_id: product._id });
				await storage.product.delete({ _id: product._id });
			}

			await storage.agent.delete({ _id });
		}

		res.status(200).json({ success: true });

		next();
	});
}
