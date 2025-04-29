const express = require("express");
const router = express.Router();
const User = require("../model/userModel")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// Example route

router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
  
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists." });
      }
  
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create user
      const newUser = new User({ name, email, password: hashedPassword });
      await newUser.save();
      res.status(201).json({
        message: "User registered successfully.",
        user: { id: newUser._id, name: newUser.name, email: newUser.email }
      });
    } catch (error) {
      console.error("Register error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  router.post("/login", async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
      }
  
      // Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
      }
  
      // Generate JWT
      const token = jwt.sign(
        {user},
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
  
      res.status(200).json({
        message: "Login successful",
        token,
        user: { id: user._id, name: user.name, email: user.email }
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

// router.get("/", (req, res) => {
//     console.log("user",req.user._id)
//   res.json({ message: "Welcome to the API!" });
// });

module.exports = router;
