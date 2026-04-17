const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const uploadRoutes = require("./routes/upload");

const app = express();

// ✅ CORS
app.use(cors({
origin: process.env.FRONTEND_URL || "*",
methods: ["GET", "POST", "PUT", "DELETE"],
allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// ✅ MongoDB Connection (FIXED)
mongoose.connect("mongodb://yash:12345@ac-mntenar-shard-00-00.cgblkah.mongodb.net:27017,ac-mntenar-shard-00-01.cgblkah.mongodb.net:27017,ac-mntenar-shard-00-02.cgblkah.mongodb.net:27017/?ssl=true&replicaSet=atlas-yk914t-shard-0&authSource=admin&appName=Cluster0")
.then(() => console.log("✅ MongoDB Connected"))
.catch((err) => {
console.error("❌ MongoDB Connection Error:", err.message);
process.exit(1);
});

// Health check
app.get("/api/health", (req, res) => {
res.json({ status: "ok", message: "ATS Backend Running 🚀" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
