import UserModel from "../models/User.model.js";
import StudentProfile from "../models/StudentProfile.model.js";
import TeacherProfile from "../models/TeacherProfile.model.js";
import ReceptionProfileModel from "../models/ReceptionProfile.model.js";
import { register } from "./auth.controller.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";


/**
 * create Receptionist
 * /api/admin/az-reception/register-receptionist
 */

export const registerReceptionist = async (req, res) => {
    let user = null;
    try {
        const {
            fullName,
            email,
            password,
            receptionRegId,
            cnic,
            salary,
            joiningDate,
            contact,
            address
        } = req.body;

        user = await register(null, null, { fullName, email, password, role: 'receptionist' });

        await ReceptionProfileModel.create([{
            userId: user._id,
            receptionistFullName: fullName,
            receptionRegId: receptionRegId.toUpperCase(),
            cnic,
            salary,
            joiningDate,
            contact,
            address
        }]);

        // Success response
        res.status(201).json({
            message: "Receptionist registered successfully",
            receptionRegId: receptionRegId.toUpperCase()
        });

    } catch (error) {
        console.error("Receptionist Registration Error:", error);

        // Manual Rollback
        if (user && user._id) {
            await UserModel.findByIdAndDelete(user._id);
        }

        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            const value = error.keyValue[field];
            let message = "Already exists";

            if (field === "email") message = "Email already registered";
            else if (field === "cnic") message = "CNIC already registered";
            else if (field === "receptionRegId") message = "Receptionist Registration ID already taken";

            return res.status(409).json({
                message: `Registration failed: ${message} (${value})`
            });
        }

        res.status(500).json({
            message: "An internal server error occurred during Receptionist registration.",
            error: error.message
        });
    }
}

// api/admin/az-reception/fetch-all-receptionists

export const fetchAllReceptionists = async (req, res) => {
    try {
        const receptionists = await ReceptionProfileModel.find();
        res.status(200).json({
            receptionists: receptionists
        });
    } catch (error) {
        res.status(400).json({
            "errMsg": "Failed to fetch receptionists"
        });
    }
}

export const removeReceptionist = async (req, res) => {
    try {

        const receptionRegId = req.params.receptionRegId.toUpperCase();
        const curRecp = await ReceptionProfileModel.findOne({ receptionRegId })

        if(!curRecp) {
            res.status(404).json({
                "msg": "No Data Found"
            });
        }

        const deletedRecp = await ReceptionProfileModel.deleteOne({
            receptionRegId
        });

        // del user
        await UserModel.findByIdAndDelete(curRecp.userId)


        res.status(200).json({
            "msg": `Deleted receptionist`
        })




    } catch (error) {
        res.status(400).json({
            "msg": "Err in deleting Receptionist",
            "error": error
        })
    }
}


// teacher Crud Operations

// api/admin/AZ-teachers/register-teacher
// api/admin/AZ-teachers/register-teacher
export const registerTeacher = async (req, res) => {
    let user = null;
    try {
        const {
            fullName,
            email,
            password,
            teacherRegId,
            cnic,
            qualification,
            salary,
            joiningDate,
            subjects,
            classes,
            contact,
            address,
            age
        } = req.body;

        user = await register(null, null, { fullName, email, password, role: 'teacher' });  // req, res -> null

        // Step 2: Create TeacherProfile
        await TeacherProfile.create([{
            userId: user._id,
            teacherFullName: fullName,
            teacherRegId: teacherRegId.toUpperCase(),
            cnic,
            qualification,
            salary,
            joiningDate,
            subjects,
            classes,
            contact,
            address,
            age
        }]);

        // Success response
        res.status(201).json({
            message: "Teacher registered successfully",
            teacherRegId: teacherRegId.toUpperCase()
        });

    } catch (error) {
        console.error("Teacher Registration Error:", error);

        // Manual Rollback
        if (user && user._id) {
            await UserModel.findByIdAndDelete(user._id);
        }

        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            const value = error.keyValue[field];
            let message = "Already exists";

            if (field === "email") message = "Email already registered";
            else if (field === "cnic") message = "CNIC already registered";
            else if (field === "teacherRegId") message = "Teacher Registration ID already taken";

            return res.status(409).json({
                message: `Registration failed: ${message} (${value})`
            });
        }

        res.status(500).json({
            message: "An internal server error occurred during teacher registration.",
            error: error.message
        });
    }
};

// api/admin/az-teachers/fetch-all-teachers
export const fetchAllTeachers = async (req, res) => {
    try {
        const teachers = await TeacherProfile.find();
        res.status(200).json({
            "teachers": teachers
        });
    } catch (error) {
        res.status(400).json({
            "errMsg": "Teacher fetching failed"
        });
    }
}

/**
 * get teachers by class 
 * api/admin/az-teachers/fetch-teachers-byClass/:class
 */

export const fetchTeachersByClass = async (req, res) => {
    try {

        const classNumberFilter = Number(req.params.class);

        if (isNaN(classNumberFilter)) {
            res.status(400).json({
                "msg": "Class number must be entered"
            });
        }

        const curTeachers = await TeacherProfile.find({
            classes: classNumberFilter
        }); //.populate('userId', 'fullName email')


        res.status(200).json({
            "TotalCount": curTeachers.length,
            "Teachers": curTeachers
        });


    } catch (error) {
        res.status(500).json({ message: "Can not find By Class Errrrrr ", error: error.message });
    }
}

/**
 * get search teachers by class + subject 
 * /admin/az-teachers/fetch-teachers-by-class-and-subject/:class/:subject
 */

export const searchTeacherByClassAndSubject = async (req, res) => {
    try {

        const clsFilter = Number(req.params.class);
        const subjectFilter = req.params.subject.toLowerCase();

        if (isNaN(clsFilter)) {
            res.status(400).json({
                "msg": "Class number must be entered"
            });
        }


        const curTeacher = await TeacherProfile.find(
            {
                classes: clsFilter,
                subjects: {
                    $in: [subjectFilter]
                }
            }
        );  // .populate('userId', 'fullName email')

        res.status(200).json({
            "TotalCount": curTeacher.length,
            "Teachers": curTeacher
        });


    } catch (error) {
        res.status(500).json({ message: "Can not find By Class and subjetcs Errrrrr ", error: error.message });
    }
}

/**
 * update teacher
 * /admin/az-teachers/update-teacher/:teacherRegId
 */

export const updateTeacher = async (req, res) => {
    try {

        const { teacherRegId } = req.params;
        const updateData = req.body;

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "No update data provided." });
        }

        // Find the teacher profile
        const teacherProfile = await TeacherProfile.findOne({ teacherRegId: teacherRegId.toUpperCase() });

        if (!teacherProfile) {
            return res.status(404).json({ message: "Teacher not found with the provided registration ID." });
        }

        // Separate data for User and TeacherProfile models
        const { fullName, email, isActive, ...profileUpdates } = updateData;
        const userUpdates = { fullName, email, isActive };

        // Filter out undefined values so we only update provided fields
        Object.keys(userUpdates).forEach(key => userUpdates[key] === undefined && delete userUpdates[key]);

        // Update User model if there's data for it
        if (Object.keys(userUpdates).length > 0) {
            await UserModel.findByIdAndUpdate(teacherProfile.userId, userUpdates, { new: true, runValidators: true });
        }

        // Update TeacherProfile model if there's data for it
        let updatedTeacherProfile = teacherProfile;
        if (Object.keys(profileUpdates).length > 0) {
            updatedTeacherProfile = await TeacherProfile.findByIdAndUpdate(
                teacherProfile._id,
                profileUpdates,
                { new: true, runValidators: true }
            );
        }

        // Fetch the latest state to ensure response is consistent
        const finalTeacherProfile = await TeacherProfile.findById(teacherProfile._id).populate('userId', 'fullName email isActive');

        res.status(200).json({
            message: "Teacher updated successfully.",
            teacher: finalTeacherProfile
        });

    } catch (error) {
        console.error("Update Teacher Error:", error);
        res.status(500).json({
            message: "An error occurred while updating the teacher.",
            error: error.message
        });
    }
}

/**
 * update the specific field (patch)
 * 
 */

/**
 * Delete teacher
 * /admin/az-teachers/delete-teacher/:teacherRegId
 */

export const deleteTeacherById = async (req, res) => {
    try {

        const teacherRegId = req.params.teacherRegId.toUpperCase();
        const currTeacher = await TeacherProfile.findOne({ teacherRegId });

        if (!currTeacher) {
            return res.status(404).json({
                msg: "No Such teacher Found"
            });
        }

        const deletedTeacher = await TeacherProfile.deleteOne({ teacherRegId });

        await UserModel.findByIdAndDelete(currTeacher.userId);

        res.status(200).json({
            msg: "teacher deleted",
            delTeacher: deletedTeacher
        })

    } catch (error) {
        res.status(400).json({
            "msg": "Err in deleting Teacher",
            "error": error
        })
    }
}

export const getAllStds = async (req, res) => {
    try {

        const getStds = await StudentProfile.find();

        
        res.status(200).json({
            msg: "All Students Data",
            getStds
        })

    } catch (error) {
        res.status(500).json({
            msg: "Error in finding students in admin",
            error
        });
        
    }
}


// Admin will de-register the student entity not by the reception desk
export const deleteStudent = async (req, res) => {
    try {
        const rollNo = req.params.rollNo.toUpperCase();

        const studentProfile = await StudentProfile.findOne({ rollNo });
        if (!studentProfile) {
            return res.status(404).json({ message: "Student not found with this Roll No." });
        }

        // Delete StudentProfile first
        await StudentProfile.deleteOne({ _id: studentProfile._id });

        // Then delete associated User
        await UserModel.findByIdAndDelete(studentProfile.userId);

        res.status(200).json({
            message: "Student deleted successfully",
            deletedRollNo: rollNo
        });

    } catch (error) {
        console.error("Delete Student Error:", error);
        res.status(500).json({
            message: "Error deleting student",
            error: error.message
        });
    }
}
