const express = require("express");
const uploadController = require("../uploads/upload.controller");

const router = express.Router();

router.use("/", uploadController);

module.exports = router;
