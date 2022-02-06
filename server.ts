import express from "express";
import cookieParser from "cookie-parser";
import log from "@utils/logger";

import { userRouter } from "@routes/user";
import { cartRouter } from "@routes/cart";
import { adminRouter } from "@routes/admin";
import { shopRouter } from "@routes/shop";
import { webhookRouter } from "@routes/webhook";
import { errorHandler } from "@middlewares/error";
import { docsRouter } from "@routes/docs";
import { cors } from "@middlewares/cors";

//initlaize express
const app = express();

//attackers can use this header to detect apps running Express
app.disable("x-powered-by");
app.use(cookieParser());

//handles cors related headers, see middleware
app.use(cors);

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
