import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Simple ping route for frontend self-check
app.get("/ping", (req, res) => {
  res.json({ status: "ok" });
});

// 📨 Gmail SMTP setup
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const RECEIVER_EMAIL = process.env.RECEIVER_EMAIL;
const ADMIN_TOKEN = process.env.ADMIN_TOKEN; // secure token for publish

app.post("/send", async (req, res) => {
  const { subject, html, token } = req.body;

  if (!token || token !== ADMIN_TOKEN) {
    return res.status(401).json({ error: "Invalid or missing token" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: EMAIL_USER, pass: EMAIL_PASS },
    });

    const info = await transporter.sendMail({
      from: EMAIL_USER,
      to: RECEIVER_EMAIL,
      subject,
      html,
    });

    console.log("✅ Email sent:", info.response);
    res.json({ success: true, message: "Post sent to Blogger" });
  } catch (error) {
    console.error("❌ Email Error:", error);
    res.status(500).json({ error: "Email sending failed" });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));

export default app;
