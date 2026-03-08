import mongoose from 'mongoose';

/**
 * Connect to MongoDB
 * @param {string} mongoURL - MongoDB connection string
 */
export const connectDB = async (mongoURL) => {
    try {
        await mongoose.connect(mongoURL);
        console.log('✅ MongoDB Connected Successfully');
        console.log('📍 Database:', mongoose.connection.db.databaseName);
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error.message);
        process.exit(1);
    }
};


