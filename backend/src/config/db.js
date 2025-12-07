import mongoose from "mongoose";

export const connectDB = async (mongoURL) => {
    try {
        await mongoose.connect(mongoURL);
        console.log("URL: " + mongoURL);
    } catch (error) {
        console.log("Đéo link được db");
        process.exit(1);
    }
}