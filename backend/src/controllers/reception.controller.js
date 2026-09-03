import UserModel from "../models/User.model.js";
import StudentProfile from "../models/StudentProfile.model.js";
import Fee from "../models/Fee.model.js";
import { register } from "./auth.controller.js";
import Attendance from "../models/Attendance.model.js";
import TeacherProfile from "../models/TeacherProfile.model.js";
import ReceptionProfileModel from "../models/ReceptionProfile.model.js";
import mongoose from "mongoose";


// Auto-increment RollNo function
//"className-getTotalStudentCount() + 1" | RollNo Archi = 09-01
async function generateRollNo(className) {

    const stdsCount = await StudentProfile.countDocuments(
        {
            className: className.toUpperCase(),
        }
    );
    const nextNumber = stdsCount+1;

    const newRollNo = `${className.toUpperCase()}-${nextNumber.toString()}`;
    return newRollNo;

}


// POST /api/reception/az-students/register-student
export const registerStudent = async (req, res) => {
    let newUser = null;
    try {
        const {
            fullName,
            email,
            password,
            // rollNo,
            fatherName,
            fatherPhone,
            contact,
            address,
            age,
            className,
            field
        } = req.body;

        newUser = await register(null, null, { fullName, email, password, role: 'student' });

        const rollNo = await generateRollNo(className);

        // Step 2: Create StudentProfile
        await StudentProfile.create([{
            userId: newUser._id,
            rollNo: rollNo,
            stdName: fullName,
            fatherName,
            fatherPhone,
            contact,
            address,
            age,
            className: className.toUpperCase(),
            field
        }]);

        res.status(201).json({
            message: "Student registered successfully",
            rollNo: rollNo.toUpperCase()
        });

    } catch (error) {
        console.error("Student Registration Error:", error);

        // Manual Rollback: If user was created but profile failed, delete the user.
        if (newUser && newUser._id) {
            await UserModel.findByIdAndDelete(newUser._id);
        }

        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            const value = error.keyValue[field];
            let message = "Already exists";

            if (field === "email") message = "Email already registered";
            else if (field === "rollNo") message = "Roll Number already taken";
            else if (field === "fatherPhone") message = "Father phone already used";

            return res.status(409).json({
                message: `Registration failed: ${message} (${value})`
            });
        }

        res.status(500).json({
            message: "An internal server error occurred during student registration.",
            error: error.message
        });
    }
}

// GET /api/reception/az-students/fetch-all-students
export const fetchAllStudents = async (req, res) => {
    try {
        const students = await StudentProfile.find()
            .populate('userId', 'fullName email isActive');

        res.status(200).json({
            total: students.length,
            students
        });
    } catch (error) {
        console.error("Fetch All Students Error:", error);
        res.status(500).json({ message: "Failed to fetch students", error: error.message });
    }
}

// GET /api/reception/az-students/fetch-student-by-rollno/:rollNo
export const fetchStudentByRollNo = async (req, res) => {
    try {
        const rollNo = req.params.rollNo.toUpperCase();

        const student = await StudentProfile.findOne({ rollNo });

        if (!student) {
            return res.status(404).json({ message: "Student not found with this Roll No." });
        }

        res.status(200).json({ student });
    } catch (error) {
        console.error("Fetch Student By RollNo Error:", error);
        res.status(500).json({ message: "Error fetching student", error: error.message });
    }
}

// GET /api/reception/az-students/fetch-students-by-class/:className
export const fetchStudentsByClass = async (req, res) => {
    try {
        const className = req.params.className.toUpperCase();

        const students = await StudentProfile.find({ className });

        res.status(200).json({
            total: students.length,
            class: className,
            students
        });
    } catch (error) {
        console.error("Fetch Students By Class Error:", error);
        res.status(500).json({ message: "Error fetching students by class", error: error.message });
    }
}

//  /api/reception/az-students/update-student/:rollNo
export const updateStudent = async (req, res) => {
    try {

        const rollNo = req.params.rollNo.toUpperCase();
        const updateData = req.body;

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "No update data provided." });
        }

        // Find student profile
        const studentProfile = await StudentProfile.findOne({ rollNo });
        if (!studentProfile) {
            return res.status(404).json({ message: "Student not found." });
        }

        // Separate updates: User fields vs Profile fields
        const { fullName, email, isActive, ...profileUpdates } = updateData;
        const userUpdates = { fullName, email, isActive };

        // Filter out undefined values so we only update provided fields
        Object.keys(userUpdates).forEach(key => userUpdates[key] === undefined && delete userUpdates[key]);

        // Update User if any user fields are provided
        if (Object.keys(userUpdates).length > 0) {
            await UserModel.findByIdAndUpdate(
                studentProfile.userId,
                userUpdates,
                { new: true, runValidators: true }
            );
        }

        // Update profile fields if there are any
        if (Object.keys(profileUpdates).length > 0) {
            await StudentProfile.findByIdAndUpdate(
                studentProfile._id,
                { $set: profileUpdates },
                { new: true, runValidators: true }
            );
        }

        // Fetch the final, populated student profile to return
        const updatedProfile = await StudentProfile.findById(studentProfile._id)
            .populate('userId', 'fullName email isActive');

        res.status(200).json({
            message: "Student updated successfully",
            student: updatedProfile
        });

    } catch (error) {
        console.error("Update Student Error:", error);

        if (error.code === 11000) {
            return res.status(409).json({
                message: "Update failed: Duplicate value detected (Email or Roll No already exists)."
            });
        }

        res.status(500).json({
            message: "An error occurred while updating the student.",
            error: error.message
        });
    }
}

// DELETE /api/reception/az-students/delete-student/:rollNo  // recep
// export const deleteStudent = async (req, res) => {
//     try {
//         const rollNo = req.params.rollNo.toUpperCase();

//         const studentProfile = await StudentProfile.findOne({ rollNo });
//         if (!studentProfile) {
//             return res.status(404).json({ message: "Student not found with this Roll No." });
//         }

//         // Delete StudentProfile first
//         await StudentProfile.deleteOne({ _id: studentProfile._id });

//         // Then delete associated User
//         await UserModel.findByIdAndDelete(studentProfile.userId);

//         res.status(200).json({
//             message: "Student deleted successfully",
//             deletedRollNo: rollNo
//         });

//     } catch (error) {
//         console.error("Delete Student Error:", error);
//         res.status(500).json({
//             message: "Error deleting student",
//             error: error.message
//         });
//     }
// }
