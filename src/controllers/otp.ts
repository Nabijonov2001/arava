import { NextFunction, Request, Response } from "express";
import { signToken } from "../middleware/auth";
import { IOTP } from "../models/OTP";
import { storage } from "../storage/main";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";
import axios from "axios";

export class OtpController {
	otpAuth = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { phone_number, code, status, type } = req.body;
		let token;

		if (status === "forget_password") {
			if (type === "client") {
				await storage.client.findOne({ phone_number });
			} else if (type === "agent") {
				await storage.agent.findOne({ phone_number });
			} else {
				await storage.admin.findOne({ phone_number });
			}
		} else if (status === "registration" || status === "change_phone") {
			if (type === "client") {
				const client = (await storage.client.find({ phone_number }, 0))[0];

				if (client) {
					return next(
						new AppError(
							400,
							`${
								status === "change_phone"
									? "Telefon raqam qaytarilmas bo`lishi kerak"
									: "Siz avval ro`yxatdan o`tgansiz"
							}`
						)
					);
				}
			} else if (type === "agent") {
				const agent = (await storage.agent.find({ phone_number }, 0))[0];

				if (agent) {
					return next(
						new AppError(
							400,
							`${
								status === "change_phone"
									? "Telefon raqam qaytarilmas bo`lishi kerak"
									: "Siz avval ro`yxatdan o`tgansiz"
							}`
						)
					);
				}
			} else {
				const admin = (await storage.admin.find({ phone_number }))[0];

				if (admin) {
					return next(
						new AppError(
							400,
							`${
								status === "change_phone"
									? "Telefon raqam qaytarilmas bo`lishi kerak"
									: "Siz avval ro`yxatdan o`tgansiz"
							}`
						)
					);
				}
			}
		}

		let otp = await storage.otp.findOne({ phone_number });

		if (!otp) {
			const code = Math.floor(1000 + Math.random() * 9000);

			otp = await storage.otp.create({ phone_number, code } as IOTP);

			await axios({
				method: "GET",
				url: "https://api.telegram.org/bot1951363591:AAFwDugSXs2tonBcp9YROP0-QrqNVc6Y6mE/sendMessage",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json;charset=UTF-8"
				},
				data: {
					chat_id: "-1001695988362",
					text: `${otp.code} is for ${otp.phone_number} in Arava`
				}
			});
		} else {
			if (!code) {
				return res.status(400).json({
					success: true,
					message:
						"Sizning telefon raqamizga kod yuborildi tizimga kirish uchun kodni tastiqlang",
					created_at: otp.created_at,
					status: "sms_sent_before"
				});
			} else if (code !== otp.code) {
				return next(
					new AppError(
						400,
						"Kod no`tog`ri kiritildi, iltimos tekshirib qaytadan urinib ko`ring"
					)
				);
			}

			token = await signToken(`${phone_number}`, "otp");
		}

		const message = token ? "otp_token_true" : "otp_token_false";

		res.status(200).json({
			success: true,
			data: {
				token,
				created_at: otp.created_at
			},
			message,
			status: token ? "sms_passed" : "sms_sent"
		});
	});
}
