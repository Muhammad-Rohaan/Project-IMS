import nodemailer from "nodemailer";
import dotenv from "dotenv";

// Load .env from backend root
dotenv.config();

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for 587
  auth: {
    user: process.env.GMAIL_USER || "learning82005@gmail.com",
    pass: process.env.GMAIL_PASS,
  },
});

// Function to send email
export const sendEmail = async (to, subject, text) => {
  try {
    const mailOptions = {
      from: process.env.GMAIL_USER || "learning82005@gmail.com",
      to,
      subject,
      text
    };

    await transporter.sendMail(mailOptions);
    // console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error(`Error sending email to ${to}:`, error);
    throw error;
  }
};
