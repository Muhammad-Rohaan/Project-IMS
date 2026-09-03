import TeacherProfile from "../models/TeacherProfile.model.js";
import AnnouncementModel from "../models/Announcement.model.js";


export const createAnnouncement = async (req, res) => {
    try {

        const { title, message, target, className, createdBy } = req.body;

        if (!title || !message || !target || !className || !createdBy) {
            return res.json({
                msg: "All fields should be entered"
            });
        }

        let newAnnouncement = new AnnouncementModel(
            {
                title: title,
                message: message,
                target: target,
                className: className ? className.toUpperCase().trim() : 'N/A',
                createdBy: createdBy
            }
        );

        await newAnnouncement.save();

        res.status(200).json({
            message: "Announcement created successfully",
            newAnnouncement
        });


    } catch (error) {
        res.status(500).json({
            msg: "Error in creating an announcement",
            err: error
        });
    }
}


//GET: all announcement
export const getAnnouncements = async (req, res) => {
    try {
        const { className } = req.params;
        const userRole = req.user.role;

        let announcement = [];
        let myAnnouncement = [];

        if (userRole === 'admin' || userRole === 'receptionist') {
            // Admins and Receptionists get EVERYTHING
            announcement = await AnnouncementModel.find({ target: 'all' }).sort({ createdAt: -1 });
            myAnnouncement = await AnnouncementModel.find({ target: 'specific-class' }).sort({ createdAt: -1 });
        } else if (userRole === 'teacher') {
            // Teachers get global + their specific classes
            announcement = await AnnouncementModel.find({ target: 'all' }).sort({ createdAt: -1 });
            
            const teacherProfile = await TeacherProfile.findOne({ userId: req.user._id });
            if (teacherProfile && teacherProfile.classes) {
                // Convert numbers to strings for comparison if needed
                const classList = teacherProfile.classes.map(c => c.toString());
                myAnnouncement = await AnnouncementModel.find({
                    target: 'specific-class',
                    className: { $in: classList }
                }).sort({ createdAt: -1 });
            }
        } else {
            // Students (or others) get global + their specific class
            announcement = await AnnouncementModel.find({ target: 'all' }).sort({ createdAt: -1 });

            if (className && 
                className.toLowerCase() !== "all" && 
                className.toLowerCase() !== "n/a" && 
                className !== "undefined") {
                myAnnouncement = await AnnouncementModel.find({
                    className: className.toUpperCase().trim(),
                    target: "specific-class"
                }).sort({ createdAt: -1 });
            }
        }

        res.status(200).json({
            announcement,
            myAnnouncement
        });

    } catch (error) {
        res.status(500).json({
            msg: "Error in fetching announcements",
            err: error.message
        });
    }
}

export const deleteAnnouncement = async (req, res) => {
    try {
        const { id } = req.params;
        const announcement = await AnnouncementModel.findByIdAndDelete(id);

        if (!announcement) {
            return res.status(404).json({
                msg: "Announcement not found"
            });
        }

        res.status(200).json({
            message: "Announcement deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            msg: "Error in deleting announcement",
            err: error.message
        });
    }
}