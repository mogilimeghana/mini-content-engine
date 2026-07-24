const axios = require("axios");

async function generateImage(prompt) {
  try {
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
      prompt
    )}?width=1024&height=1024&nologo=true`;

    const response = await axios.get(imageUrl, {
      responseType: "arraybuffer",
      timeout: 60000,
    });

    return response.data;
  } catch (error) {
    console.error(
      "Pollinations Error:",
      error.response?.status,
      error.message
    );
    return null;
  }
}

module.exports = generateImage;