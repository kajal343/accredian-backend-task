const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendReferralEmail = async (recipientEmail, referralCode) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: recipientEmail,
    subject: "Referral Successful!",
    text: `Your referral code is: ${referralCode}`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendReferralEmail;
