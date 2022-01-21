const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: `${process.env.GMAIL}`,
    pass: `${process.env.GMAIL_PASSWORD}`,
  },
});

const sendEmail = (email, subject, html) => {
  console.log(process.env.GMAIL, process.env.GMAIL_PASSWORD);
  return transporter.sendMail({
    from: `${process.env.GMAIL}`,
    to: email,
    subject: subject,
    html: html,
  });
};

module.exports = sendEmail;
