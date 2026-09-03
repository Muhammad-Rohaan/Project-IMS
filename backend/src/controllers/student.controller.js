import TeacherProfileModel from "../models/TeacherProfile.model.js";
import StudentProfileModel from "../models/StudentProfile.model.js";
import ResultImage from "../models/ResultImage.model.js";
import UserModel from "../models/User.model.js";
import FeeModel from "../models/Fee.model.js";
import NotesModel from "../models/Notes.model.js"


export const getNotes = async (req, res) => {
    try {
        // FIX: Changed req.user_id to req.user._id to match your auth middleware
        const student = await StudentProfileModel.findOne({ userId: req.user._id });
        
        if (!student) 
            return res.status(404).json({ message: "Student profile not found" });

        // Fetch notes matching the student's class (Case-insensitive)
        const notes = await NotesModel.find({ 
            className: student.className.toUpperCase() 
        }).sort({ createdAt: -1 });

        res.json({
            notes: notes.map(file => ({
                _id: file._id,
                title: file.title,
                subject: file.subject,
                className: file.className,
                fileUrl: file.fileUrl,
                createdAt: file.createdAt
            }))
        });

    } catch (error) {
        console.error("Get Notes Error:", error);
        res.status(500).json({ message: "Error fetching notes." });
    }
}


// Get Results for Student's Class
export const getMyClassResults = async (req, res) => {
    try {
        // Student apni class ke results dekhega
        const student = await StudentProfileModel.findOne({ userId: req.user._id });
        if (!student) return res.status(404).json({ message: "Student profile not found." });

        const results = await ResultImage.find({ className: student.className })

        // console.log(results);


        res.json({
            className: student.className,
            totalResults: results.length,
            results: results.map(result => ({
                testName: result.testName,
                className: result.className,
                imageUrl: result.imageUrl
            }))

        });

    } catch (error) {
        console.error("Get My Class Results Error:", error);
        res.status(500).json({ message: "Error fetching results." });
    }
};


export const getFeeStatus = async (req, res) => {
    try {

        const student = await StudentProfileModel.findOne({ userId: req.user._id });
        if (!student) {
            return res.status(404).json({
                msg: "Student not found"
            });
        }

        const fees = await FeeModel.find({
            stdId: student._id,
            rollNo: student.rollNo
        });


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

        });




    } catch (error) {
        res.status(500).json({
            msg: "error in getting fees status",
            error
        })
    }
}

