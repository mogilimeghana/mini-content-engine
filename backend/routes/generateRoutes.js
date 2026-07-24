const express = require("express");

const router = express.Router();

const upload = require("../config/multer");

const {
    generateContent,
    getJobById,
    getAllJobs
} = require("../controllers/generateController");

router.post(
    "/generate",
    upload.single("productImage"),
    generateContent
);

router.get("/jobs/:id", getJobById);

router.get("/jobs", getAllJobs);

module.exports = router;