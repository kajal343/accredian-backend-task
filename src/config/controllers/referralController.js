const prisma = require("../config/prismaClient");
const sendReferralEmail = require("../services/emailService");

exports.createReferral = async (req, res) => {
  try {
    const { name, email, referralCode, referredBy } = req.body;

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: "Email already exists. Use a different email." });
    }

    // Create new referral
    const newUser = await prisma.user.create({
      data: { name, email, referralCode, referredBy },
    });

    // Send email
    await sendReferralEmail(email, referralCode);

    res.status(201).json({ message: "Referral saved successfully", newUser });
  } catch (error) {
    console.error("Error saving referral:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
