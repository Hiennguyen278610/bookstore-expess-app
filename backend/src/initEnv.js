import dotenv from 'dotenv';
dotenv.config({ path: "./.env" });

export const envs = {
    PORTBE: process.env.PORTBE || 3001,
    API_TAG: process.env.API_TAG,
    MONGODB_URL: process.env.MONGODB_URL
}