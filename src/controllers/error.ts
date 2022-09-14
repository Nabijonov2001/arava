import { NextFunction, Request, Response } from "express";
import config from "../config/config";
import AppError from "../utils/appError";

export class ErrorController {
	sendErrorDev = (err: AppError, req: Request, res: Response, next: NextFunction) => {
		return res.status(err.statusCode).json({
			success: false,
			error: err,
			message: err.message,
			stack: err.stack
		});
	};

	hanle = (err: AppError, req: Request, res: Response, next: NextFunction) => {
		err.statusCode = err.statusCode || 500;
		err.status = err.status || "error";

		this.sendErrorDev(err, req, res, next);
	};
}
