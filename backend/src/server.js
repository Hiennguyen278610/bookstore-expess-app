// backend/src/server.js


import "dotenv/config";
import express from 'express';
import userRoute from './routes/UserRouters.js';
import bookRoute from './routes/BookRouters.js';
import cartRoute from './routes/CartRouters.js';
import { connectDB } from './config/db.js';
import cors from 'cors';
import { seedAdmin } from './utils/seedAdmin.js';
import categoryRoute from './routes/CategoryRouters.js';
import orderRoute from './routes/OrderRouters.js';
import authRoute from './routes/AuthRouters.js';
import authorRouter from './routes/AuthorRouters.js';
import publisherRouter from './routes/PublisherRouters.js';
import supplierRouter from './routes/SupplierRouters.js';
import receiptRouter from './routes/ReceiptRouters.js';
// import { setup } from './utils/hosting.js';
import supplyReceiptRouter from './routes/SupplyReceiptRouters.js';
import { setup } from './utils/hosting.js';
import paymentRouter from './routes/PaymentRouters.js';
import { errorHandler } from './middlewares/errorHandle.js';
import addressRouter from './routes/AddressRouters.js';
import statisticsRouter from './routes/StatisticsRouters.js';

const app = express();
connectDB(process.env.MONGODB_URL);
// setup(app) // Commented out to avoid ngrok conflict

app.use(cors());
app.use(express.json()); // To parse JSON bodies
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded bodies
app.use(process.env.API_TAG + "/auth", authRoute)
app.use(process.env.API_TAG + "/address", addressRouter)
app.use(process.env.API_TAG + "/users", userRoute);
app.use(process.env.API_TAG + "/books", bookRoute);
app.use(process.env.API_TAG + "/cart", cartRoute);
app.use(process.env.API_TAG + "/categories", categoryRoute);
app.use(process.env.API_TAG + "/orders", orderRoute);
app.use(process.env.API_TAG + "/authors", authorRouter);
app.use(process.env.API_TAG + "/publishers", publisherRouter)
app.use(process.env.API_TAG + "/suppliers", supplierRouter)
app.use(process.env.API_TAG + "/receipts", receiptRouter);
app.use(process.env.API_TAG + "/supply-receipts", supplyReceiptRouter);
app.use(process.env.API_TAG + "/payment", paymentRouter)
app.use(process.env.API_TAG + "/statistics", statisticsRouter)
app.listen(process.env.PORTBE, async () => {
  console.log("Server is running on port " + process.env.PORTBE);
});

await seedAdmin();

app.use(errorHandler)