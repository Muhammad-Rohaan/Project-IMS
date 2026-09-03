// src/api/axios.js
// import dotenv from 'dotenv'
import axios from 'axios';

// dotenv.config();

// Backend ka port
// NOTE: Vite's built-in import.meta.env.BASE_URL is "/" in dev, which causes
// requests to hit the Vite dev server (404). Use VITE_API_URL instead.
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true, // Must be true to send/receive cookies
    headers: { 'Content-Type': 'application/json' },
});

const AI_URL = import.meta.env.VITE_AI_URL || "http://localhost:8000/api";

export const aiAPI = axios.create({
    baseURL: AI_URL,
    // withCredentials: true,
    headers: { "Content-Type": "application/json" },
});


export default axiosInstance;
// Yey allow kar raha hai frontend ko backend sey baat karanay mai.
