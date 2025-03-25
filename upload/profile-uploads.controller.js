const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const db = require("../_helpers/db");

// Ensure profile-uploads directory exists
const profileUploadDir = path.join(__dirname, "../profile-uploads");
if (!fs.existsSync(profileUploadDir)) {
    fs.mkdirSync(profileUploadDir, { recursive: true });
}

// Configure Multer for storing profile images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, profileUploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

// Handle Profile Image Upload
router.post("/", upload.single("profile_image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
  
      const { account_id } = req.body;
      if (!account_id) {
        return res.status(400).json({ message: "Account ID is required" });
      }
  
      const profile_image = `/profile-uploads/${req.file.filename}`;
      console.log("Saving Profile Image to DB:", { account_id, profile_image });
  
      // Check if profile already exists
      const existingProfile = await db.ProfileUpload.findOne({ where: { account_id } });
  
      let updatedProfile;
      if (existingProfile) {
        // Delete old image file (optional cleanup)
        const oldPath = path.join(profileUploadDir, path.basename(existingProfile.profile_image));
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
  
        // Update existing record
        await existingProfile.update({ profile_image });
        updatedProfile = existingProfile;
      } else {
        // Create new record
        updatedProfile = await db.ProfileUpload.create({ account_id, profile_image });
      }
  
      res.status(201).json({
        message: "Profile image uploaded successfully",
        profile: updatedProfile,
      });
    } catch (error) {
      console.error("Error in profile upload:", error);
      res.status(500).json({ message: "Failed to upload profile image" });
    }
  });  

// Fetch Profile Image for a User
router.get("/:account_id", async (req, res) => {
    try {
        const { account_id } = req.params;
        const profile = await db.ProfileUpload.findOne({ where: { account_id } });

        if (!profile) {
            return res.status(404).json({ message: "Profile image not found" });
        }

        res.status(200).json({ profile });
    } catch (error) {
        console.error("Error fetching profile image:", error);
        res.status(500).json({ message: "Failed to fetch profile image" });
    }
});

// Serve profile uploads statically
router.use("/", express.static(profileUploadDir));

module.exports = router;
