import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import log from "@utils/logger";

import { userRouter } from "@routes/user";
import { cartRouter } from "@routes/cart";
import { adminRouter } from "@routes/admin";
import { shopRouter } from "@routes/shop";
import { webhookRouter } from "@routes/webhook";
import { errorHandler } from "@middlewares/error";
import { docsRouter } from "@routes/docs";
import helmet from "helmet";

//initlaize express
const app = express();

app.use(helmet());
app.use(cookieParser());

//handles cors related headers
//need to explicity specify origin when using creds = true
//OPTIONS = preflight requests
app.use(
	cors({
		origin: [
			"http://localhost:3000",
			"https://e-commerce-frontend-bkw1491.vercel.app",
			"https://e-commerce-frontend-git-main-bkw1491.vercel.app",
			"https://e-commerce-frontend-hazel.vercel.app"
		],
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		credentials: true
	})
);

//expects raw format
app.use("/webhook", webhookRouter);
app.use("/docs", docsRouter);
//place all routes that expect json after this
app.use(express.json());
//register routes
app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/shop", shopRouter);
app.use("/cart", cartRouter);
//custom error handler
app.use(errorHandler);

//listen on port defined in .env file
app.listen(process.env.PORT, () => {
	log(`Listening On Port ${process.env.PORT}`);
});
