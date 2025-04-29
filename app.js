const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const mongoose = require("mongoose"); // ✅ Add this

dotenv.config();

const app = express();

// ✅ Connect to MongoDB
mongoose.connect("mongodb+srv://sajid:Sajid@brunei.yw4ksmm.mongodb.net/brunei")
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));
app.use(express.static("public"));

// Routes
const indexRoutes = require("./routes/index");
const customerRoutes = require("./routes/customer");
app.use("/api", indexRoutes);
app.use("/api/customer", customerRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something broke!" });
});

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
