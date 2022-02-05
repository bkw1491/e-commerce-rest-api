import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import log from "@utils/logger";

import { userRouter } from "@routes/user";
import { cartRouter } from "@routes/cart";
import { adminRouter } from "@routes/admin";
import { shopRouter } from "@routes/shop";
import { webhookRouter } from "@routes/webhook";
import { errorHandler } from "@middlewares/error";
import { docsRouter } from "@routes/docs";

//initlaize express
const app = express();

//attackers can use this header to detect apps running Express
app.disable("x-powered-by");
//need this since jwt stored in httpOnly cookie for now
app.use(cookieParser());

//adds the Access-Control-Allow-Credentials header to req
//TODO this will change for production
app.use(
	cors({
		origin: "http://localhost:3000",
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
