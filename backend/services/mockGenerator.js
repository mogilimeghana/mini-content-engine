const pool = require("../config/db");
const generateImage = require("./imageGenerator");

const fs = require("fs");
const path = require("path");

const mockImageGeneration = async (jobId, prompt) => {
  try {
    // Generate image bytes from Hugging Face
    const imageBuffer = await generateImage(prompt);

    if (!imageBuffer) {
      throw new Error("Image generation failed.");
    }

    // Ensure uploads folder exists
    const uploadDir = path.join(__dirname, "..", "uploads");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Create image filename
    const fileName = `generated-${jobId}.png`;

    const filePath = path.join(uploadDir, fileName);

    // Save image
    fs.writeFileSync(filePath, imageBuffer);

    // Path to store in database
    const imageUrl = `/uploads/${fileName}`;

    // Update database
    await pool.query(
      `UPDATE jobs
       SET status = $1,
           image_url = $2
       WHERE id = $3`,
      [
        "completed",
        imageUrl,
        jobId
      ]
    );

    console.log(`✅ Job ${jobId} completed`);
  } catch (error) {
    console.error("Image generation failed:", error.message);
  }
};

module.exports = {
  mockImageGeneration
};