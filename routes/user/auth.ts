import express from "express";

import { Request, Response } from "express";
import { validate } from "@middlewares/validate";
import { asyncHandler } from "@middlewares/async";
import { UserSchema } from "@schemas/user";
import { issue } from "@utils/token";
import { cookie } from "@utils/cookie";
import { toResponse } from "@utils/response";
import { verifyJWT } from "@middlewares/verify";
import { JsonWebTokenError } from "jsonwebtoken";

export const authRouter = express.Router();

authRouter.post(
	"/login",
	validate(UserSchema.auth, "body"),
	asyncHandler(async (req: Request, res: Response) => {
		//creates a jwt
		const token = issue(req.body);
		//set cookie on client
		res.cookie("auth", token, cookie);
		res.status(200).send(toResponse("auth success"));
	})
);

authRouter.post(
	"/logout",
	verifyJWT("user"),
	asyncHandler(async (req: Request, res: Response) => {
		//remove the cookie to logout if it exists
		if (req.cookies("auth")) res.clearCookie("auth");
		res.status(200).send(toResponse("logout"));
	})
);
