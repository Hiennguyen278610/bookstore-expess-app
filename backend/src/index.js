import express from "express";
import { envs } from "./initEnv.js";
import userRoute from "./routes/usersRouters.js";
import { connectDB } from "./config/db.js";

const app = express();
connectDB(envs.MONGODB_URL);

app.use(envs.API_TAG, userRoute);

app.listen(envs.PORTBE, () => {
  console.log("Sugoi quá vậy !!!");
});