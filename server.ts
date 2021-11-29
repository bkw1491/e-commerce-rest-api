//resolve .env variables
//?? move this somewhere else?
import { resolve } from "path"
import { config } from "dotenv"
config({ path: resolve(__dirname, "./config/.env") })

import express from 'express';

const app = express();

app.listen(process.env.PORT, () => {
  console.log(`⚡[Server]: Listening On Port ${process.env.PORT}`)
});