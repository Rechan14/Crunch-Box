const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const uploadService = require("../uploads/upload.service");

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer for storing images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Handle Image Upload
router.post("/", upload.single("image"), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const image_name = req.file.filename;
    const imagePath = `/uploads/${image_name}`;

    console.log(" Storing Image in DB:", { image_name, imagePath });

    // Store image in database
    const newImage = await uploadService.create({ image_name, image: imagePath });

    if (!newImage) {
      return res.status(500).json({ message: "Failed to save image to database" });
    }

    res.status(201).json({
      message: "Image uploaded successfully",
      image: newImage,
    });
  } catch (error) {
    console.error(" Error in upload:", error);
    next(error);
  }
});

// Serve uploaded images statically
router.use("/", express.static(uploadDir));

module.exports = router;
