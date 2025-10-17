// server.js
import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";

// ✅ Define env variables here (for testing only, not for production!)
const EMAIL_HOST = "smtp.gmail.com";
const EMAIL_PORT = 587;
const EMAIL_USER = "rrvyapar@gmail.com";
const EMAIL_PASS = "rvffpyxuwkwfthwq";
const EMAIL_TO = "rrvyapar@gmail.com";

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // parse JSON from frontend

// Create transporter
const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  secure: false, // 587 is not secure
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

// Verify transporter
transporter.verify((error, success) => {
  if (error) console.log("Mailer Error:", error);
  else console.log("Server is ready to send emails");
});

// Route
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
      from: `"RR Vyapar Registration" <${EMAIL_USER}>`,
      to: EMAIL_TO,
      subject: `New Registration: ${name || phone}`,
      html: `
        <h3>New RR Vyapar Registration</h3>
        <p><strong>Phone:</strong> ${phone}</p>
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
    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Send Email Error:", error);
    res.status(500).json({ message: "Failed to send email" });
  }
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
