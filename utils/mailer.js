const nodemailer = require("nodemailer");
require("dotenv").config();

const sendMail = async (message, subject, receipient) => {
  const transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS,
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
