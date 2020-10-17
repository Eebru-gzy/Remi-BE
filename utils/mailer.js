const nodemailer = require("nodemailer");
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

module.exports = sendMail;
