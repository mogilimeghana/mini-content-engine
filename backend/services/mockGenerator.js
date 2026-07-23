const pool = require("../config/db");

const mockImageGeneration = (jobId) => {

    setTimeout(async () => {

        try {

            await pool.query(
                `UPDATE jobs
                 SET status = $1,
                     image_url = $2
                 WHERE id = $3`,
                [
                    "completed",
                    "/uploads/sample.png",
                    jobId
                ]
            );

            console.log(`✅ Job ${jobId} completed`);

        } catch (error) {

            console.error("Mock generation failed:", error);

        }

    }, 3000);

};

module.exports = {
    mockImageGeneration
};