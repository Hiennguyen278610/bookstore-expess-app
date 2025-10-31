import express from "express";
import { envs } from "./initEnv.js";
import userRoute from "./routes/UserRouters.js";
import bookRoute from "./routes/BookRouters.js";
import cartRoute from "./routes/CartRouters.js";
import { connectDB } from "./config/db.js";
import cors from "cors";
import { seedAdmin } from './utils/seedAdmin.js';
import categoryRoute from './routes/CategoryRouters.js';
import orderRoute from './routes/OrderRouters.js';
import authRoute from './routes/AuthRouters.js';
import passport from './config/passport.js';
import authorRouter from './routes/AuthorRouters.js';
import publisherRouter from './routes/PublisherRouters.js';
import supplierRouter from './routes/SupplierRouters.js';
import receiptRouter from './routes/ReceiptRouters.js';

const app = express();
connectDB(envs.MONGODB_URL);

app.use(cors());
app.use(passport.initialize());
app.use(express.json()); // To parse JSON bodies
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded bodies
app.use(envs.API_TAG + "/auth", authRoute)
app.use(envs.API_TAG + "/users", userRoute);
app.use(envs.API_TAG + "/books", bookRoute);
app.use(envs.API_TAG + "/cart", cartRoute);
app.use(envs.API_TAG + "/categories", categoryRoute);
app.use(envs.API_TAG + "/orders", orderRoute);
app.use(envs.API_TAG + "/authors", authorRouter);
app.use(envs.API_TAG + "/publishers", publisherRouter)
app.use(envs.API_TAG + "/suppliers", supplierRouter)
app.use(envs.API_TAG + "/receipts", receiptRouter);
app.listen(envs.PORTBE, () => {
  console.log("Server is running on port " + envs.PORTBE);
});

await seedAdmin();