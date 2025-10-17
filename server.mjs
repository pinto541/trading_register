// server.mjs
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sgMail from "@sendgrid/mail";

// ✅ Load environment variables from .env (only used locally)
dotenv.config();

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Set SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// ✅ Verify basic setup route
app.get("/", (req, res) => {
  res.send("RR Vyapar Mailer API is running ✅");
});

// ✅ Email sending route
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

    // ✅ Email details
    const msg = {
      to: process.env.TO_EMAIL, // recipient (your inbox)
      from: process.env.FROM_EMAIL, // verified sender in SendGrid
      subject: `New Registration: ${name || phone}`,
      html: `
        <h2>New RR Vyapar Registration</h2>
        <p><strong>Name:</strong> ${name || "N/A"}</p>
        <p><strong>Email:</strong> ${email || "N/A"}</p>
        <p><strong>Phone:</strong> ${phone || "N/A"}</p>
        <p><strong>Equity Exp:</strong> ${equityExp || "N/A"}</p>
        <p><strong>F&O Exp:</strong> ${fnoExp || "N/A"}</p>
        <p><strong>Fresher:</strong> ${isFresher ? "Yes" : "No"}</p>
        <p><strong>Total Loss:</strong> ${totalLoss || "N/A"}</p>
        <p><strong>Total Profit:</strong> ${totalProfit || "N/A"}</p>
        <p><strong>Occupation:</strong> ${occupation || "N/A"}</p>
        <p><strong>Reason:</strong> ${reason || "N/A"}</p>
      `,
    };

    // ✅ Send the email
    await sgMail.send(msg);

    console.log("✅ Email sent successfully!");
    res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("❌ Send Email Error:", error.response?.body || error.message);
    res.status(500).json({
      success: false,
      message: "Failed to send email",
      error: error.response?.body || error.message,
    });
  }
});

// ✅ Use dynamic port for Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
