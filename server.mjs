// server.js
import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Check if API key is loaded
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
if (!SENDGRID_API_KEY) {
  console.error("❌ SENDGRID_API_KEY is missing. Set it in .env or Render secrets!");
  process.exit(1);
}

// Email addresses
const EMAIL_FROM = "RR Vyapar <rrvyapar@gmail.com>"; // verified sender in SendGrid
const EMAIL_TO = "rrvyapar@gmail.com"; // recipient email

// Create transporter using SendGrid
const transporter = nodemailer.createTransport({
  service: "SendGrid",
  auth: {
    user: "apikey", // literal string "apikey"
    pass: SENDGRID_API_KEY,
  },
});

// Verify transporter
transporter.verify((error, success) => {
  if (error) console.error("Mailer verification error:", error);
  else console.log("✅ Server is ready to send emails via SendGrid");
});

// Registration route
app.post("/send-registration", async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      equityExp,
      fnoExp,
      isFresher,
      totalLoss,
      totalProfit,
      occupation,
      reason,
    } = req.body;

    const mailOptions = {
      from: EMAIL_FROM,
      to: EMAIL_TO,
      subject: `New Registration: ${name || phone}`,
      html: `
        <h3>New RR Vyapar Registration</h3>
        <p><strong>Phone:</strong> ${phone || "N/A"}</p>
        <p><strong>Name:</strong> ${name || "N/A"}</p>
        <p><strong>Email:</strong> ${email || "N/A"}</p>
        <p><strong>Equity Exp:</strong> ${equityExp || "N/A"}</p>
        <p><strong>F&O Exp:</strong> ${fnoExp || "N/A"}</p>
        <p><strong>Fresher:</strong> ${isFresher ? "Yes" : "No"}</p>
        <p><strong>Total Loss:</strong> ${totalLoss || "N/A"}</p>
        <p><strong>Total Profit:</strong> ${totalProfit || "N/A"}</p>
        <p><strong>Occupation:</strong> ${occupation || "N/A"}</p>
        <p><strong>Reason:</strong> ${reason || "N/A"}</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Registration email sent:", name || phone);
    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("❌ Send Email Error:", error);
    res.status(500).json({ message: "Failed to send email" });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
