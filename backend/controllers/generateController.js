const { v4: uuidv4 } = require("uuid");
const pool = require("../config/db");
const { mockImageGeneration } = require("../services/mockGenerator");
const generatePrompt = require("../services/promptGenerator");
// POST /generate
const generateContent = async (req, res) => {

    try {

        const { productName, description } = req.body;

        const referenceImage = req.file
    ? `/uploads/${req.file.filename}`
    : null;

        if (!productName || !description) {
    return res.status(400).json({
        message: "Product name and description are required."
    });
}

const prompt = await generatePrompt(productName, description);

        const jobId = uuidv4();

        const status = "processing";

     await pool.query(
    `INSERT INTO jobs
    (
        id,
        product_name,
        description,
        reference_image,
        prompt,
        status
    )
    VALUES
    (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6
    )`,
    [
        jobId,
        productName,
        description,
        referenceImage,
        prompt,
        status
    ]
);

        // Start background mock generation
       mockImageGeneration(jobId, prompt);

        res.status(201).json({
            jobId,
            status
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Something went wrong"
        });

    }

};

// GET /jobs/:id
const getJobById = async (req, res) => {

    try {

        const { id } = req.params;

        const result = await pool.query(
            "SELECT * FROM jobs WHERE id = $1",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        const job = result.rows[0];

        res.status(200).json({
            jobId: job.id,
            prompt: job.prompt,
            status: job.status,
            imageUrl: job.image_url,
            createdAt: job.created_at
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Something went wrong"
        });

    }

};

// GET /jobs
const getAllJobs = async (req, res) => {

    try {

        const result = await pool.query(
            `SELECT * FROM jobs
             ORDER BY created_at DESC`
        );

        res.status(200).json(result.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Something went wrong"
        });

    }

};

module.exports = {
    generateContent,
    getJobById,
    getAllJobs
};