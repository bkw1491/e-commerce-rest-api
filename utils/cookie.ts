import { CookieOptions } from "express";

//http only prevents client-side javascript from accessing cookie
//??no sensitive info is stored in the cookie anyway, so can store in the header maybe??
export const cookie: CookieOptions = {
	maxAge: Number(process.env.JWT_EXPIRY),
	httpOnly: false,
	secure: false,
	sameSite: "strict"
};
