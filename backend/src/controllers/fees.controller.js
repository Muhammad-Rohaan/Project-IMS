import UserModel from "../models/User.model.js";
import StudentProfile from "../models/StudentProfile.model.js";
import Fee from "../models/Fee.model.js";
import { register } from "./auth.controller.js";
import Attendance from "../models/Attendance.model.js";
import TeacherProfile from "../models/TeacherProfile.model.js";
import ReceptionProfileModel from "../models/ReceptionProfile.model.js";


// receptions other methods (fees collection, attendance)

export const collectFee = async (req, res) => {
    try {

        const { rollNo, month, year, feesAmount } = req.body;

        if (!rollNo || !month || !year || !feesAmount) {
            res.status(400).json({ message: "All fields are required" });
            return;
        }

        const student = await StudentProfile.findOne({
            rollNo: rollNo.toUpperCase()
        });



        if (!student) {
            res.status(404).json({ message: "Student not found" });
            return;
        }

        let fees = await Fee.findOne({
            stdId: student._id,
            month,
            year
        });

        if (!fees) {
            fees = new Fee(
                {
                    stdId: student._id,
                    rollNo: student.rollNo,
                    studentName: student.stdName,
                    className: student.className,
                    month,
                    year,
                    feesAmount,
                    collectedBy: req.user.fullName,
                    collectedDate: new Date()
                }
            );
        }

        fees.feesAmount = feesAmount;
        fees.collectedBy = req.user.fullName || "Receptionist";
        fees.collectedDate = new Date();


        // await fees.save();

        if (fees.feesAmount >= 4500 || fees.feesAmount >= 5000) {
            fees.status = 'paid';

        } else {
            fees.status = 'pending';
        }


        await fees.save();

        res.status(200).json({
            message: "Fee collected successfully",
            fees
        });

        // SEND EMAIL: may be in V2 IDK


    } catch (error) {
        console.error("Collect Fee Error:", error);
        if (error.code === 11000) {
            return res.status(400).json({ message: "Fee record for this month/year already exists" });
        }
        res.status(500).json({ message: "Error collecting fee", error: error.message });
    }
}


// 3. Get Student Fee Status by Roll No
export const getStudentFeeStatus = async (req, res) => {
    try {
        const { rollNo } = req.params;
        const student = await StudentProfile.findOne({ rollNo: rollNo.toUpperCase() });

        if (!student) return res.status(404).json({ message: "Student not found" });

        const fees = await Fee.find({ stdId: student._id });

        res.status(200).json({
            student: {
                name: student.stdName,
                rollNo: student.rollNo,
                className: student.className

            },

            fees: fees.map(fee => ({
                status: fee.status,
                collectedBy: fee.collectedBy,
                collectedDate: fee.collectedDate
            }))

        })


    } catch (error) {
        res.status(500).json({ message: "Error fetching fee status" });
    }
}


export const getAllPendingFees = async (req, res) => {
    try {
        const pending = await Fee.find({
            status: "pending"
        });

        res.status(200).json(pending);
    } catch (error) {
        res.status(500).json({ message: "Error fetching pending fees" });
    }
}

// A method which will be triggered by n8n
export const changeFeeStatusToUnpaid = async (req, res) => {
    try {

        const { month, year } = req.body;

        if (!month || !year) {
            return res.status(400).json({
                message: "Month and Year are required"
            });
        }

        const students = await StudentProfile.find();

        let createdRecords = [];

        for (const student of students) {

            const feeExists = await Fee.findOne({
                stdId: student._id,
                month,
                year
            });

            if (!feeExists) {

                const unpaidFee = await Fee.create({
                    stdId: student._id,
                    rollNo: student.rollNo,
                    studentName: student.stdName,
                    className: student.className,
                    month,
                    year,
                    feesAmount: 0,
                    status: "unpaid",
                    collectedBy: null,
                    collectedDate: null
                });

                createdRecords.push(unpaidFee);
            }
        }

        res.status(200).json({
            message: "Unpaid fee records generated successfully",
            month,
            year,
            totalCreated: createdRecords.length
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Error in changeFeeStatusToUnpaid",
            error: error.message
        });
    }
};


// API for n8n user + studentprofile + fees

export const getStudentsFeeData = async (req, res) => {
    try {

        const students = await StudentProfile.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $unwind: "$user"
            },
            {
                $lookup: {
                    from: "fees",
                    localField: "_id",
                    foreignField: "stdId",
                    as: "fee"
                }
            },
            {
                $unwind: {
                    path: "$fee",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 0,

                    studentId: "$_id",
                    rollNo: 1,

                    studentName: "$stdName",
                    email: "$user.email",

                    className: 1,
                    field: 1,

                    feeAmount: {
                        $ifNull: ["$fee.feesAmount", 0]
                    },

                    feeStatus: {
                        $ifNull: ["$fee.status", "unpaid"]
                    },

                    month: "$fee.month",
                    year: "$fee.year"
                }
            }
        ]);

        res.status(200).json({
            students
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Error fetching student fee data",
            error: error.message
        });
    }
};