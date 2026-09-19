const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173,https://ims-wine-three.vercel.app")
    .split(",")
    .map(o => o.trim().replace(/\/$/, ""));

app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (curl, Postman, same-origin)
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true
}));
app.use(express.json());

const mongoUri = process.env.MONGO_URI;
connectDB(mongoUri).catch(() => {});

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.use('/api/quizzes', require('./routes/quizzes'));
app.use('/api/results', require('./routes/results'));

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', service: 'AI_MCQs_Gen' });
})

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`running on port ${port}`);

});
