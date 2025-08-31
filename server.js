const express = require("express");
const multer = require("multer");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Check/create uploads/ before multer
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const upload = multer({ dest: "uploads/" });

app.use(express.json());

app.post("/test", upload.single("file"), (req, res) => {
    res.send("✅ File received!");
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
