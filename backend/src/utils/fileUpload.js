import multer from "multer";
import path from "path";

// Set up storage engine
const storage = multer.diskStorage({
    destination: './uploads/', // Folder where files will be saved
    filename: function (req, file, cb) {
        // Rename file to include timestamp to avoid name collisions
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });