import express from "express";
import log from "@utils/logger";

import { Request, Response } from "express";
import { validate } from "@middlewares/validate";
import { asyncHandler } from "@middlewares/async";
import { UserSchema } from "@schemas/user";
import { issue } from "@utils/token";
import { cookie } from "@utils/cookie";
import { toResponse } from "@utils/response";

export const authRouter = express.Router();

authRouter.post(
	"/",
	validate(UserSchema.auth, "body"),
	asyncHandler(async (req: Request, res: Response) => {
		//creates a jwt
		const token = issue(req.body);
		//set cookie on client
		res.cookie("auth", token, cookie);
		log(`${res.cookie}`);
		res.status(200).send(toResponse("auth success"));
	})
);
