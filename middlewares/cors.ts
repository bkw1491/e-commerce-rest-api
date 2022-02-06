import { NextFunction, Request, Response } from "express";
export function cors(req: Request, res: Response, next: NextFunction) {
	res.header("Access-Control-Allow-Origin", "http://*");
	res.header("Access-Control-Allow-Credentials", "true");
	res.header("Vary", "true");
	next();
}
