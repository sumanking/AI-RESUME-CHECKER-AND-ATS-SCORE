require("dotenv").config();
const axios = require("axios");

async function testGroq() {
  try {
    const res = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama3-70b-8192",
        messages: [
          { role: "user", content: "Say hello from Groq!" }
        ],
        temperature: 0.7
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("✅ Groq API is working!");
    console.log("Response:", res.data.choices[0].message.content);
  } catch (err) {
    console.error("❌ Groq API key error:", err.response?.data || err.message);
  }
}

testGroq();
