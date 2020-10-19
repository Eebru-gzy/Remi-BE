const nodemailer = require("nodemailer");
const axios = require("axios");
require("dotenv").config();

const sendMail = async (message, subject, receipient) => {
  const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  // send mail with defined transport object
  let info = await transport.sendMail({
    from: '"REMI EIM" <no-reply@remi.com>', // sender address
    to: receipient, // list of receivers
    subject: subject, // Subject line
    html: message, // html body
  });
  console.log("Message sent: %s", info.messageId);
};

const sendEmail = async (
  sender_email,
  receiver_email,
  receiver_name,
  subject,
  message
) => {
  try {
    await axios({
      method: "post",
      url: "https://api.sendinblue.com/v3/smtp/email",
      headers: {
        accept: "application/json",
        "api-key": process.env.MAIL_API_KEY,
        "content-type": "application/json",
      },
      data: {
        sender: {
          name: "REMI EIM",
          email: sender_email,
        },
        to: [
          {
            email: receiver_email,
            name: receiver_name,
          },
        ],
        subject: subject,
        htmlContent: message,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { sendMail, sendEmail };
