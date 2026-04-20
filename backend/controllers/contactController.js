const mailer = require("../services/mailer");

exports.sendContact = async (req, res) => {
  const { name, email, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ error: "name, email and message are required" });
  }

  try {
    await mailer.sendMail({
      from: `${name} <${email}>`,
      to: process.env.GMAIL_USER,
      subject: `Contact form message from ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    });
    return res.json({ message: "Email sent" });
  } catch (err) {
    console.error("Contact email error:", err);
    return res.status(500).json({ error: "Failed to send email" });
  }
};
