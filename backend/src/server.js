import express from "express";
import { envs } from "./initEnv.js";
import userRoute from "./routes/usersRouters.js";
import { connectDB } from "./config/db.js";

const app = express();
connectDB(envs.MONGODB_URL);

app.use(express.json()); // To parse JSON bodies
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded bodies
app.use(envs.API_TAG + "/users", userRoute);

app.listen(envs.PORTBE, () => {
  console.log("Server is running on port " + envs.PORTBE);
});