// const multer = require("multer");
// const express = require("express");
// const router = express.Router();

// // Set up Multer storage
// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// router.post("/upload", upload.single("image"), (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ error: "No file uploaded" });
//   }
//   res.json({ message: "Image uploaded successfully!" });
// });

// module.exports = router;

const express = require("express");
const router = express.Router();

// Example upload route
router.post("/upload", (req, res) => {
  res.json({ message: "File upload route placeholder" });
});

module.exports = router;

