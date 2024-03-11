const nodemailer = require("nodemailer");

require("dotenv").config();

const sendEmail = async (email, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      service: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "lokeshcdckap@gmail.com",
        pass: "dudnxkzqtjqswagk",
      },
    });

    await transporter.sendMail({
      from: "lokeshcdckap@gmail.com",
      to: email,
      subject: subject,
      html: html,
    });

    console.log("email sent sucessfully");
  } catch (error) {
    console.log(error, "email not sent");
  }
};

module.exports = sendEmail;
