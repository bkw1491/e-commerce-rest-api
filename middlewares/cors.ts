import { NextFunction, Request, Response } from "express";
export function cors(req: Request, res: Response, next: NextFunction) {
	res.header("Access-Control-Allow-Origin", "http://localhost:3000");
	res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
	res.header("Access-Control-Allow-Credentials", "true");
	res.header("Vary", "true");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested With, Content-Type, Accept"
	);
	next();
}
