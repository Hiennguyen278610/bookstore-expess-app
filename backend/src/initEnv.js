import dotenv from 'dotenv';
dotenv.config({ path: "./.env" });

export const envs = {
    PORTBE: process.env.PORTBE || 3001,
    API_TAG: process.env.API_TAG,
    MONGODB_URL: process.env.MONGODB_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN
}