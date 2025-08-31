const express = require("express");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// ✅ Check uploads folder BEFORE importing multer
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// ✅ Only now require multer (after folder exists)
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

app.post("/test", upload.single("file"), (req, res) => {
  res.send("✅ File uploaded successfully!");
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
