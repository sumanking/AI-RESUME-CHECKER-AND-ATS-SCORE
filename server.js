const express = require("express");
const multer = require("multer");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");
const axios = require("axios");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Create 'uploads' directory if not exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const upload = multer({ dest: "uploads/" });

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/analyze", upload.single("resume"), async (req, res) => {
  if (!req.file) return res.status(400).send("No file uploaded");

  try {
    const dataBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdfParse(dataBuffer);
    const resumeText = pdfData.text;
    const jobDescription = req.body.jobDescription || "";

    let prompt;

    if (jobDescription.trim() === "") {
      prompt = `
You are a professional resume reviewer.

Analyze the resume below and return feedback in HTML using the following structure:

<div class="feedback-container">
  <h3>🧾 Formatting and Organization</h3>
  ...
  <h3>✅ Final Improvements Checklist</h3>
</div>

Use <h3>, <ul>, <li>, <p> — clean HTML only.

Resume:
${resumeText}
`;
    } else {
      prompt = `
You are an expert resume reviewer and ATS (Applicant Tracking System).

TASK:
1. Analyze the resume below and return structured HTML using:
   <h3>🧾 Formatting and Organization</h3>
   <h3>🧑‍💼 Professional Summary</h3>
   <h3>💻 Technical Skills</h3>
   <h3>🧪 Projects</h3>
   <h3>🎓 Education</h3>
   <h3>📜 Certifications</h3>
   <h3>🏆 Achievements</h3>
   <h3>❌ Hobbies</h3>
   <h3>✅ Final Improvements Checklist</h3>

2. Then compare the resume against the job description and provide:
   <h3>📊 ATS Score</h3>
   - Match score (percentage)
   - Missing keywords/skills
   - Short explanation

Wrap all output in:
<div class="feedback-container">...</div>

Use only HTML (no markdown, no code blocks).

Resume:
${resumeText}

Job Description:
${jobDescription}
`;
    }

    const groqRes = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant", // ✅ supported as of now
        messages: [
          {
            role: "system",
            content: "You are a professional resume and ATS evaluator."
          },
          {
            role: "user",
            content: prompt
          }
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

    const feedback = groqRes.data.choices[0].message.content;
    res.json({ feedback });

  } catch (err) {
    console.error("❌ Error:", err.message);
    if (err.response) {
      console.error("📦 Groq API Response Error:", err.response.data);
    }
    res.status(500).send("Something went wrong during analysis.");
  } finally {
    fs.unlinkSync(req.file.path);
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
