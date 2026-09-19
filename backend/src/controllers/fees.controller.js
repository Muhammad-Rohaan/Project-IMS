import StudentProfile from "../models/StudentProfile.model.js";
import Fee from "../models/Fee.model.js";
import Attendance from "../models/Attendance.model.js";
import TeacherProfile from "../models/TeacherProfile.model.js";
import ReceptionProfileModel from "../models/ReceptionProfile.model.js";

// receptions other methods (fees collection, attendance)

export const collectFee = async (req, res) => {
    try {

        const { rollNo, month, year, feesAmount } = req.body;

        if (!rollNo || !month || !year || feesAmount === undefined || feesAmount === null || feesAmount === '') {
            res.status(400).json({ message: "All fields are required" });
            return;
        }

        const student = await StudentProfile.findOne({
            rollNo: String(rollNo).trim().toUpperCase()
        });

        if (!student) {
            res.status(404).json({ message: "Student not found" });
            return;
        }

        const numericAmount = Number(feesAmount);

        let fees = await Fee.findOne({
            stdId: student._id,
            month,
            year: Number(year)
        });

        if (!fees) {
            fees = new Fee(
                {
                    stdId: student._id,
                    rollNo: student.rollNo,
                    studentName: student.stdName,
                    className: student.className,
                    month,
                    year: Number(year),
                    feesAmount: numericAmount,
                    collectedBy: req.user?.fullName || "Receptionist",
                    collectedDate: new Date()
                }
            );
        } else {
            fees.feesAmount = numericAmount;
            fees.collectedBy = req.user?.fullName || "Receptionist";
            fees.collectedDate = new Date();
        }

        if (numericAmount > 0) {
            fees.status = 'paid';
        } else {
            fees.status = 'unpaid';
        }

        await fees.save();

        res.status(200).json({
            message: "Fee collected successfully",
            fees
        });

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
        const student = await StudentProfile.findOne({ rollNo: String(rollNo).trim().toUpperCase() });

        if (!student) return res.status(404).json({ message: "Student not found" });

        const fees = await Fee.find({ stdId: student._id }).sort({ year: -1, createdAt: -1 });

        res.status(200).json({
            student: {
                name: student.stdName,
                rollNo: student.rollNo,
                className: student.className
            },

            fees: fees.map(fee => ({
                _id: fee._id,
                status: fee.status,
                month: fee.month,
                year: fee.year,
                feesAmount: fee.feesAmount,
                collectedBy: fee.collectedBy,
                collectedDate: fee.collectedDate
            }))

        })


    } catch (error) {
        res.status(500).json({ message: "Error fetching fee status", error: error.message });
    }
}

// Removed fees Pending feature 
export const getAllPendingFees = async (req, res) => {
    try {
        const fees = await Fee.find({
            status: { $in: ["pending", "unpaid"] }
        }).sort({ createdAt: -1 });

        res.status(200).json(fees);
    } catch (error) {
        res.status(500).json({ message: "Error fetching pending fees", error: error.message });
    }
}

// A method which will be triggered by n8n, Cron job or Frontend manually
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
                year: Number(year)
            });

            if (!feeExists) {

                const unpaidFee = await Fee.create({
                    stdId: student._id,
                    rollNo: student.rollNo,
                    studentName: student.stdName,
                    className: student.className,
                    month,
                    year: Number(year),
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
            year: Number(year),
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
            // Join user email
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $unwind: {
                    path: "$user",
                    preserveNullAndEmptyArrays: true
                }
            },
            // Join ALL fee records for this student
            {
                $lookup: {
                    from: "fees",
                    localField: "_id",
                    foreignField: "stdId",
                    as: "allFees"
                }
            },
            // Sort the fee array by year desc then createdAt desc so index 0 = latest
            {
                $addFields: {
                    sortedFees: {
                        $sortArray: {
                            input: "$allFees",
                            sortBy: { year: -1, createdAt: -1 }
                        }
                    }
                }
            },
            // Project one row per student with the latest fee's data
            {
                $project: {
                    _id: 0,
                    studentId: "$_id",
                    rollNo: 1,
                    studentName: "$stdName",
                    email: "$user.email",
                    className: 1,
                    field: 1,
                    feesAmount: { $ifNull: [{ $arrayElemAt: ["$sortedFees.feesAmount", 0] }, 0] },
                    feeAmount:  { $ifNull: [{ $arrayElemAt: ["$sortedFees.feesAmount", 0] }, 0] },
                    status:    { $ifNull: [{ $arrayElemAt: ["$sortedFees.status",     0] }, "unpaid"] },
                    feeStatus: { $ifNull: [{ $arrayElemAt: ["$sortedFees.status",     0] }, "unpaid"] },
                    month: { $ifNull: [{ $arrayElemAt: ["$sortedFees.month", 0] }, null] },
                    year:  { $ifNull: [{ $arrayElemAt: ["$sortedFees.year",  0] }, null] }
                }
            }
        ]);

        return res.status(200).json({ students });

    } catch (error) {
        console.error("getStudentsFeeData Error:", error);
        return res.status(500).json({
            message: "Error fetching student fee data",
            error: error.message
        });
    }
};


export const getAllUnpaidFees = async (req, res) => {
    try {
        const unpaid = await Fee.find({
            status: "unpaid"
        }).sort({ createdAt: -1 });

        res.status(200).json(unpaid);
    } catch (error) {
        res.status(500).json({ message: "Error in unpaid fees", error: error.message });
    }
}