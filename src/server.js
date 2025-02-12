// Load environment variables from .env
require('dotenv').config();

const express = require('express');
const { PrismaClient } = require('@prisma/client');
const nodemailer = require('nodemailer');

const app = express();
const prisma = new PrismaClient();

// ✅ Middleware to parse JSON requests
app.use(express.json());

// ✅ Check database connectivity
prisma.$connect()
    .then(() => console.log("✅ Connected to MySQL Database"))
    .catch((err) => console.error("❌ Database connection error:", err));

// ✅ Log that routes are registered
console.log("✅ Routes registered: GET /api/users, POST /api/users");

// ✅ GET: Fetch all users
app.get('/api/users', async (req, res) => {
    try {
        console.log("📥 Received GET request at /api/users");
        const users = await prisma.user.findMany();
        res.json(users);
    } catch (error) {
        console.error("❌ Error fetching users:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// ✅ POST: Create Referral (Save referral data)
app.post('/api/users', async (req, res) => {
    try {
        console.log("📥 Received POST request at /api/users", req.body);

        const { name, email, referralCode, referredBy } = req.body;

        // ✅ Validate request
        if (!name || !email || !referralCode) {
            return res.status(400).json({ error: "Name, Email, and Referral Code are required!" });
        }

        // ✅ Check if email already exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: "Email already exists!" });
        }

        // ✅ Create a new user in the database
        const newUser = await prisma.user.create({
            data: { name, email, referralCode, referredBy },
        });

        // ✅ Send referral email
        await sendReferralEmail(email, referralCode);

        res.status(201).json({ message: "Referral submitted successfully!", user: newUser });
    } catch (error) {
        console.error("❌ Error creating referral:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// ✅ Function to send referral email using Gmail SMTP
async function sendReferralEmail(email, referralCode) {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Your Referral Code",
            text: `Thank you for joining! Your referral code is: ${referralCode}`
        };

        await transporter.sendMail(mailOptions);
        console.log(`📧 Referral email sent to ${email}`);
    } catch (error) {
        console.error("❌ Email sending error:", error);
    }
}

// ✅ Start Express Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
