const nodemailer = require("nodemailer");

require("dotenv").config();

const sendEmail = async (email, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "email-smtp.us-east-1.amazonaws.com",
      port: 587,
      secure: false,
      tls: {
        ciphers: "TLSv1.2",
      },
      auth: {
        user: "AKIARGASIQDT447MXSVT",
        pass: "BMpUncusQwJ2MDaoqyZ3wUtK102C4zTLVNxOhO74BwL5",
      },
    });

    await transporter.sendMail({
      from: "support@dckap.co",
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
