const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function generatePrompt(productName, description) {
  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content:
            "You are an expert AI prompt engineer. Convert product details into a detailed product photography prompt for an AI image generator.",
        },
        {
          role: "user",
          content: `
Product Name: ${productName}

Description: ${description}

Generate one detailed image generation prompt only.
Do not explain anything.
`,
        },
      ],
      temperature: 0.8,
      max_tokens: 150,
    });

    return completion.choices[0].message.content.trim();
  } catch (error) {
    console.error("Groq Error:", error.message);

    // Fallback prompt
    return `${productName}. ${description}`;
  }
}

module.exports = generatePrompt;