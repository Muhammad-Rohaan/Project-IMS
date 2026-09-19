import TeacherProfileModel from "../models/TeacherProfile.model.js";
import StudentProfileModel from "../models/StudentProfile.model.js";
import cloudinary from "../utils/cloudinary.js";
import ResultImage from "../models/ResultImage.model.js";
import UserModel from "../models/User.model.js";
import NotesModel from "../models/Notes.model.js";
import fs from "fs/promises";




export const getStudentsByClass = async (req, res) => {
  try {

    const clsFilter = req.params.className;

    const stds = await StudentProfileModel.find({
      className: clsFilter
    })

    if (!stds) {
      res.status(404).json({
        msg: "Not Found any Student"
      });
    }

    res.status(200).json({
      msg: "Students",
      data: stds
    });


  } catch (error) {
    res.status(500).json({
      msg: "Error in searching",
      err: error
    });
  }
}



// ________________________________________

// Notes upload feature.
export const uploadNotes = async (req, res) => {
  let tempFilePath = null;
  try {
    // 1. Check if file exists
    if (!req.file) {
      return res.status(400).json({ message: "Please select a file to upload" });
    }
    tempFilePath = req.file.path;

    const { title, subject, className } = req.body;
    if (!title || !subject || !className) {
      return res.status(400).json({ message: "Title, Subject, and Class are required" });
    }

    // 2. Upload to Cloudinary 
    // We use resource_type: "auto" so Cloudinary accepts PDFs/Raw files
    const result = await cloudinary.uploader.upload(tempFilePath, {
      folder: "class_notes",
      resource_type: "raw",
      access_mode: "public",
      public_id: `${subject}_${title.replace(/\s+/g, '_')}_${Date.now()}`
    });

    // 3. Save reference to MongoDB
    const newNote = await NotesModel.create({
      title,
      subject,
      className: className.toUpperCase(),
      fileUrl: result.secure_url,
      publicId: result.public_id,
      uploadedBy: req.user._id // From protect middleware
    });

    res.status(201).json({
      success: true,
      message: "Notes uploaded successfully!",
      note: newNote
    });

  } catch (error) {
    console.error("Upload Notes Error:", error);
    res.status(500).json({ message: "Failed to upload notes." });
  } finally {
    // 4. Always delete the temp file from your server 'uploads' folder
    if (tempFilePath) {
      try {
        await fs.unlink(tempFilePath);
      } catch (unlinkError) {
        console.error("Error deleting temp file:", unlinkError);
      }
    }
  }
};


// Upload Result Image
export const uploadResultImage = async (req, res) => {
  let tempFilePath = null;
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image file needed" });
    }
    tempFilePath = req.file.path;

    const { className, testName } = req.body;
    const publicId = `${className.toUpperCase()}_${testName.replace(/ /g, '_')}_${Date.now()}`;

    if (!className || !testName) {
      return res.status(400).json({ message: "Class Name aur Test Name zaroori hai" });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "results",
      public_id: publicId,
      overwrite: false, // Don't overwrite existing files with the same name
    });

    // Save to DB
    const newResult = await ResultImage.create({
      className: className.toUpperCase(),
      testName,
      imageUrl: result.secure_url,
      publicId: result.public_id,
      uploadedBy: req.user._id
    });

    res.status(201).json({
      message: "Result uploaded successfully!",
      result: {
        className: newResult.className,
        testName: newResult.testName,
        imageUrl: newResult.imageUrl
      }
    });

  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res.status(409).json({ message: "A result for this class and test name already exists." });
    }
    res.status(500).json({ message: "Upload failed due to an internal error." });
  } finally {
    if (tempFilePath) {
      await fs.unlink(tempFilePath); // Clean up the temporary file from the 'uploads' folder
    }
  }
};

export const deleteResultImage = async (req, res) => {
  try {

    // const curImg = await ResultImage.find(req.params.pubId);
    const pubId = await decodeURIComponent(req.params.pubId);
    const delImg = await ResultImage.findOneAndDelete({
      publicId: pubId
    });

    if (!delImg) {
      return res.status(404).json({
        msg: "Not Found"
      });
    }
    
    await cloudinary.uploader.destroy(pubId, { resource_type: 'raw' });

    res.json({
      msg: "Deleted Result Image"
    });

  } catch (error) {
    console.error("Delete Result Error:", error);
    res.status(500).json({
      msg: "Failed to delete result",
      err: error.message
    });
  }
}


// Delete notes

// Delete notes
export const deleteNote = async (req, res) => {
  try {
    const { pubId } = req.params;
    const decodedPubId = decodeURIComponent(pubId);

    const deletedNote = await NotesModel.findOneAndDelete({
      publicId: decodedPubId
    });

    if (!deletedNote) {
      return res.status(404).json({
        success: false,
        message: "Note not found in database."
      });
    }
    await cloudinary.uploader.destroy(decodedPubId, { resource_type: 'raw' });

    res.status(200).json({
      success: true,
      message: "Note and associated file deleted successfully."
    });

  } catch (error) {
    console.error("Delete Note Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete note.",
      error: error.message
    });
  }
};


// Get All Results (Teacher/Admin)
export const getAllResults = async (req, res) => {
  try {
    const results = await ResultImage.find()
      .sort({ uploadedAt: -1 })
      .populate('uploadedBy', 'fullName');

    res.json({ total: results.length, results });
  } catch (error) {
    res.status(500).json({ message: "Error" });
  }
};
