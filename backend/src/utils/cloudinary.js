// config/cloudinary.js
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dqdqzvgwd",
  api_key: process.env.CLOUDINARY_API_KEY || "152336255173364",
  api_secret: process.env.CLOUDINARY_API_SECRET || "abi_UD_iYB9hphGX8-4ANNQCF0c",
});

export default cloudinary;