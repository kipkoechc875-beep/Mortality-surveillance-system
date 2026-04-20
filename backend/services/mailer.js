const nodemailer = require('nodemailer');

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
  return transporter;
}

async function sendMail({ to, subject, text, html, from }) {
  const t = getTransporter();
  const mail = {
    from: from || process.env.GMAIL_USER,
    to,
    subject,
    text,
    html,
  };

  return new Promise((resolve, reject) => {
    t.sendMail(mail, (err, info) => {
      if (err) return reject(err);
      resolve(info);
    });
  });
}

module.exports = { sendMail };
