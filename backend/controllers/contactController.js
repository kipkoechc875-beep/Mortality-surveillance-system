const nodemailer = require("nodemailer");

exports.sendContact = async (req, res) => {
  const { name, email, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ error: "name, email and message are required" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: `${name} <${email}>`,
      to: process.env.GMAIL_USER,
      subject: `Contact form message from ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    };

    await transporter.sendMail(mailOptions);
    return res.json({ message: "Email sent" });
  } catch (err) {
    console.error("Contact email error:", err);
    return res.status(500).json({ error: "Failed to send email" });
  }
};
