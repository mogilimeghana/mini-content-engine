const express = require("express");

const router = express.Router();

const {
    generateContent,
    getJobById,
    getAllJobs
} = require("../controllers/generateController");

router.post("/generate", generateContent);
router.get("/jobs/:id", getJobById);
router.get("/jobs", getAllJobs);

module.exports = router;