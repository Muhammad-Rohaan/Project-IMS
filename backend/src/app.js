import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import bcrypt from "bcryptjs";
import UserModel from "./models/User.model.js";

import connectDB from "../src/db/ConfigDb.js";

// Import Routes
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import teacherRoutes from "./routes/teacher.routes.js";
import studentRoutes from "./routes/student.routes.js";
import receptionRoutes from "./routes/reception.routes.js";
import feeRoutes from "./routes/fee.routes.js"
import attendanceRoutes from "./routes/attendance.routes.js"
import announcementRoutes from "./routes/announcement.routes.js"
// import n8nRoutes from "./routes/n8n.routes.js"
import { registerStudent } from "./controllers/reception.controller.js";
import { changeFeeStatusToUnpaid, getAllPendingFees, getStudentsFeeData } from "./controllers/fees.controller.js";

dotenv.config();

// dotenv.config({ path: "../.env" });

const app = express();
const port = process.env.PORT || 5000;

// Middlewares
// CORS: allow the dev origin and the deployed frontend. Configure via
// CLIENT_URL env var; multiple origins can be comma-separated.
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
    .split(",")
    .map(o => o.trim());

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
app.use(cookieParser());

// DB Connection
connectDB();


app.get("/", (req, res) => {
    res.json({
        message: "Welcome to AZ"
    });
})

// --- TEMPORARY ROUTE FOR FIRST ADMIN REGISTRATION ---
// IMPORTANT: REMOVE THIS AFTER CREATING YOUR FIRST ADMIN
app.post("/api/setup/register-first-admin", async (req, res) => {
    try {
        const adminCount = await UserModel.countDocuments({ role: 'admin' });
        if (adminCount > 0) {
            return res.status(403).json({ message: "An admin user already exists." });
        }

        const { fullName, email, password } = req.body;
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "Please provide fullName, email, and password." });
        }

        const encryptedPassword = await bcrypt.hash(password, 10);
        const admin = await UserModel.create({
            fullName,
            email,
            password: encryptedPassword,
            role: 'admin'
        });
        res.status(201).json({ message: "First admin user created successfully.", userId: admin._id });
    } catch (error) {
        res.status(500).json({ message: "Error setting up first admin.", error: error.message });
    }
});

// Mount Routers
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/reception", receptionRoutes);
app.use("/api/reception/attendance", attendanceRoutes);
app.use("/api/reception/fees", feeRoutes);

app.use("/api/announcement", announcementRoutes)


// ----------------------------------------------------------
// For n8n automation:

app.post('/n8n/register-student', registerStudent);
app.get('/n8n/fetch-fee-records', getAllPendingFees);
app.post('/n8n/fee-status-unpaid', changeFeeStatusToUnpaid);
app.get('/n8n/get-stdfees-details', getStudentsFeeData);




// ----------------------------------------------------------


app.listen(port, () => {
    console.log(`App Running on http://localhost:${port}/`);

})