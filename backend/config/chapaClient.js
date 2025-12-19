// backend/config/chapaClient.js
import dotenv from 'dotenv';
import { Chapa } from './chapaClass.js';

dotenv.config();

if (!process.env.CHAPA_SECRET_KEY) {
  throw new Error('CHAPA_SECRET_KEY is not set. Add CHAPA_SECRET_KEY to your .env or environment variables.');
}

export const chapa = new Chapa({ secretKey: process.env.CHAPA_SECRET_KEY });
export default chapa;