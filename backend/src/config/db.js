import mongoose from "mongoose";

export const connectDB = async (mongoURL) => {
    try {
        await mongoose.connect(mongoURL);
        console.log("Sugoi quá vậy, link được MongoDB");
    } catch (error) {
        console.log("Đéo link được db");
        process.exit(1);
    }
}