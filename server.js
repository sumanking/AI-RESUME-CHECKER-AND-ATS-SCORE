const express = require("express");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

// ✅ Ensure upload folder exists BEFORE multer is required
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// ✅ Only now require multer
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post("/test", upload.single("file"), (req, res) => {
  res.send("✅ File uploaded successfully!");
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
