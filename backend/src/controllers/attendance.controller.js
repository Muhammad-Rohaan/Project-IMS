// import UserModel from "../models/User.model";
import AttendanceModel from "../models/Attendance.model.js";
import StudentProfileModel from "../models/StudentProfile.model.js";
import UserModel from "../models/User.model.js";
import { sendEmail } from "../utils/email.js";


export const markAttendance = async (req, res) => {
    try {

        const { rollNo, status } = req.body;
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Aaj ki date only

        if (!rollNo || !status) {
            return res.status(400).json({ message: "Roll No aur Status zaroori hai" });
        }

        const std = await StudentProfileModel.findOne({
            rollNo: rollNo.toUpperCase()
        });

        if (!std) {
            return res.status(404).json({ message: "Student Not Found" });
        }

        const existingStdAttendance = await AttendanceModel.findOne({
            studentId: std._id,
            date: {
                $gte: today
            }
        });

        if (existingStdAttendance) {
            return res.status(400).json({ message: "Attendance already marked today" });
        }

        const attendance = await AttendanceModel.create(
            {
                studentId: std._id,
                rollNo: std.rollNo.toUpperCase(),
                studentName: std.stdName,
                className: std.className,
                date: new Date(),
                status
            }
        );

        let stdUserId = std.userId;


        const user = await UserModel.findById(stdUserId);

        // console.log(user.email);



        const message = `
🔴 Attendance Alert

Student: ${std.stdName}
Status: ${status}
Date: ${new Date().toDateString()}

- AZ Coaching Management System
    `;

        await sendEmail(user.email, "Attendance Notification", message);


        res.json({
            message: "Attendance marked successfully",
            attendance: {
                rollNo: std.rollNo,
                name: std.stdName,
                status,
                date: attendance.date
            }
        });



    } catch (error) {
        res.status(500).json({
            message: "Error marking attendance",
            error
        });
        console.log(error);

    }
}

