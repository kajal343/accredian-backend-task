require("dotenv").config();
const express = require("express");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();

app.use(express.json()); // Middleware to parse JSON

const PORT = process.env.PORT || 5000;

// 🚀 API to create a new user with a referral code
app.post("/register", async (req, res) => {
  try {
    const { name, email, referralCode, referredBy } = req.body;

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        referralCode,
        referredBy,
      },
    });

    res.status(201).json({ message: "User registered successfully!", user: newUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 🚀 API to get all users
app.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 🚀 Root Route
app.get("/", (req, res) => {
  res.send("Refer & Earn Backend is running! 🚀");
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server started on http://localhost:${PORT}`);
});
