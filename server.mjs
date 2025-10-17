import express from "express";
import multer from "multer";
import nodemailer from "nodemailer";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const app = express();
app.use(cors());

// Setup multer for file upload
const upload = multer({ dest: "uploads/" });

// Route to handle loan form submission
app.post(
  "/send-loan",
  upload.fields([
    { name: "adharCard", maxCount: 1 },
    { name: "panCard", maxCount: 1 },
    { name: "bankStatement", maxCount: 1 },
    { name: "salarySlip", maxCount: 1 },
    { name: "addressProof", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const {
        name,
        phone,
        email,
        loanType,
        companyName
      } = req.body;

      // Build attachments
      const attachments = [];
      for (const key in req.files) {
        const file = req.files[key][0];
        attachments.push({
          filename: file.originalname,
          path: file.path,
        });
      }

      // Setup Nodemailer
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      // Email content
      const mailOptions = {
        from: `" Application" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_TO,
        subject: `New  Application from ${name}`,
        html: `
          <h3> Application Received</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Loan Type:</strong> ${loanType}</p>
          <p><strong>Company:</strong> ${companyName}</p>
        `,
        attachments,
      };

      await transporter.sendMail(mailOptions);

      // Cleanup uploaded files
      attachments.forEach((a) => fs.unlinkSync(a.path));

      res.status(200).json({ message: "Loan application sent successfully!" });
    } catch (err) {
      console.error("Error sending mail:", err);
      res.status(500).json({ error: "Failed to send email" });
    }
  }
);

app.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});
