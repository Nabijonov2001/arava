import _ from "lodash";
import path from "path";
import sharp from "sharp";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { unlink } from "fs/promises";
import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import { storage } from "../storage/main";
import AppError from "../utils/appError";
import { IAdmin } from "../models/Admin";
import { signToken } from "../middleware/auth";
import { ISession } from "../models/Session";

export class AdminController {
	getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { id, user: admin } = res.locals;

		if (admin.status !== "super_admin")
			if (!admin.role?.admin?.get)
				return next(new AppError(401, "Sizni bunday vakolatingiz yoq!"));

		const search = req.query.search as string;
		delete req.query.search;

		const admins = await storage.admin.find({
			...req.query,
			status: "admin",
			_id: { $ne: id },
			$or: [
				{ first_name: { $regex: search.trim(), $options: "i" } },
				{ last_name: { $regex: search.trim(), $options: "i" } }
			]
		});

		res.status(200).json({
			success: true,
			data: {
				admins
			}
		});
	});

	getOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		let { id, user: admin } = res.locals,
			_id = req.params.id;

		let role;

		if (admin.status !== "super_admin")
			if (!admin.role?.admin?.get)
				if (id !== _id) return next(new AppError(401, "Sizni bunday vakolatingiz yoq!"));

		if (admin.status === "super_admin" || admin.role?.admin?.get)
			role = await storage.dynamic_role.find({});

		admin = await storage.admin.findOne({ _id });

		res.status(200).json({
			success: true,
			data: {
				admin,
				role
			}
		});
	});

	create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		let { id, user: admin } = res.locals;

		if (admin.status !== "super_admin")
			if (!admin.role?.admin?.create)
				return next(new AppError(401, "Sizni bunday vakolatingiz yoq!"));

		const { password, phone_number } = req.body;
		admin = (await storage.admin.find({ phone_number }))[0];

		if (admin) return next(new AppError(400, "Siz avval adminni ro`yhatdan o`tqizgansiz"));

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

		await storage.admin.create({
			...req.body,
			image,
			password: hashPassword
		});

		const admins = await storage.admin.find({
			...req.query,
			status: "admin",
			_id: { $ne: id }
		});

		res.status(201).json({
			success: true,
			data: {
				admins
			},
			message: "Admin mofaqiyotlik qo'shildi"
		});
	});

	login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { phone_number, password } = req.body;

		const admin = (await storage.admin.find({ phone_number }, "password"))[0];

		if (!admin)
			return next(
				new AppError(
					401,
					`Telefon raqam yoki parol noto'g'ri iltimos tekshirib qaytadan urinib ko'ring!`
				)
			);

		const check_password = await bcrypt.compare(password, admin.password);

		if (!check_password)
			return next(
				new AppError(
					401,
					`Telefon raqam yoki parol noto'g'ri iltimos tekshirib qaytadan urinib ko'ring!`
				)
			);

		const user_agent = req.headers["user-agent"] as string,
			ip_address = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

		const session = (
			await storage.session.find({
				user_id: admin._id,
				user_agent
			})
		)[0];

		if (!session) {
			await storage.session.create({
				user_id: admin._id,
				user_agent,
				ip_address
			} as ISession);
		}

		const token = await signToken(admin._id, "admin");

		res.status(201).json({
			success: true,
			data: {
				token,
				admin: _.pick(admin, [
					"_id",
					"image",
					"status",
					"first_name",
					"last_name",
					"phone_number",
					"profession",
					"role",
					"createdAt"
				])
			}
		});
	});

	update = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { id, user: _admin } = res.locals,
			_id = req.params.id;

		if (_admin.status !== "super_admin")
			if (!_admin.role?.admin?.update) {
				delete req.body.role;
				delete req.body.phone_number;

				if (id !== _id) return next(new AppError(401, "Sizni bunday vakolatingiz yoq!"));
			}
		const { password = "1111", new_password, image } = req.body;

		let admin = (await storage.admin.find({ _id }, "password"))[0];

		if (new_password) {
			const check_password = await bcrypt.compare(password, admin.password);

			if (!check_password)
				if (_admin.status !== "super_admin")
					if (!_admin.role?.admin?.update)
						return next(
							new AppError(
								401,
								`Parol no'to'rg'ri iltomos tekshirib qaytadan urinib ko'ring`
							)
						);

			if (new_password && _id !== id) await storage.session.deleteMany({ user_id: _id });

			const salt = await bcrypt.genSalt();
			const hashPassword = await bcrypt.hash(new_password, salt);
			admin.password = hashPassword;
		}

		if (!image) {
			if (admin.image) {
				await unlink(path.join(__dirname, "../../../uploads", admin.image));
				admin.image = "";
			}
		}

		if (req.file) {
			const image_path = `images/${req.file.fieldname}-${uuidv4()}.png`;
			sharp(req.file.buffer)
				.resize({ width: 500 })
				.png()
				.toFile(path.join(__dirname, "../../../uploads", image_path));

			if (admin.image) await unlink(path.join(__dirname, "../../../uploads", admin.image));

			admin.image = image_path;
		}

		admin = await storage.admin.update(
			{ _id },
			{
				...req.body,
				image: admin.image,
				password: admin.password
			}
		);

		res.status(200).json({
			success: true,
			data: {
				admin
			}
		});
	});

	changePhoneNumber = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { id } = res.locals,
			_id = req.params.id;

		const admin = await storage.admin.update({ _id }, { phone_number: id } as IAdmin);

		res.status(200).json({
			success: true,
			data: {
				admin
			}
		});
	});

	forgetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { id } = res.locals,
			{ password } = req.body;

		let hashPassword = await bcrypt.genSalt();
		hashPassword = await bcrypt.hash(password, hashPassword);

		const admin = await storage.admin.update({ phone_number: id }, {
			password: hashPassword
		} as IAdmin);

		const token = await signToken(admin._id, "admin");

		res.status(201).json({
			success: true,
			data: {
				token,
				admin
			}
		});
	});

	delete = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		let { id, user: admin } = res.locals,
			_id = req.params.id;

		if (admin.status !== "super_admin")
			if (!admin.role?.admin?.delete || _id !== id)
				return next(new AppError(401, "Sizni bunday vakolatingiz yoq!"));

		admin = await storage.admin.delete({ _id });

		if (admin.image) {
			await unlink(path.join(__dirname, "../../../uploads", admin.image));
		}

		await storage.complaint.deleteMany({ admin_id: _id });

		const admins = await storage.admin.find({
			...req.query,
			status: "admin",
			_id: { $ne: id }
		});

		res.status(200).json({
			success: true,
			data: {
				admins
			}
		});
	});

	createSuperAdmin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { password } = req.body;

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

		const admin = await storage.admin.create({
			...req.body,
			image,
			password: hashPassword
		});

		res.status(201).json({
			success: true,
			data: {
				admin
			},
			message: "Admin mofaqiyotlik qo'shildi"
		});
	});
}
