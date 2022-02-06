import { NextFunction, Request, Response } from "express";
export function cors(req: Request, res: Response, next: NextFunction) {
	//need to specify the origin explicity since allow creds = true
	res.header("Access-Control-Allow-Origin", "http://localhost:3000");
	//allow requests which contain these headers
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept"
	);
	//options is the pre-flight request
	res.header(
		"Access-Control-Allow-Methods",
		"GET, POST, PUT, DELETE, HEAD, OPTIONS"
	);
	//using cookies so need this
	res.header("Access-Control-Allow-Credentials", "true");
	next();
}
