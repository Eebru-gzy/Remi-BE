const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

module.exports = (company_email, link) => {
  const myOAuth2Client = new OAuth2(
    "488778928270-atsohirv5vm754lspcoq8iar6s7stoqr.apps.googleusercontent.com",
    "bjqRxzUsRFRMJBh91N3vV78p"
  );
  myOAuth2Client.setCredentials({
    refresh_token:
      "1//04jWwV63XQXJPCgYIARAAGAQSNwF-L9IrF9AiLTYwV_tXcjgfVHKe5WONNA2oPRoXEB3RbCbRpcrYSHZfXq-Jh2ZC7GgATXd5c10",
  });
  const myAccessToken = myOAuth2Client.getAccessToken();

  const transport = nodemailer.createTransport({
    name: "remi-hr.herokuapp.com",
    service: "gmail",
    secure: true,
    auth: {
      type: "OAuth2",
      user: "opehardesina@gmail.com", //your gmail account you used to set the project up in google cloud console"
      clientId:
        "488778928270-atsohirv5vm754lspcoq8iar6s7stoqr.apps.googleusercontent.com",
      clientSecret: "bjqRxzUsRFRMJBh91N3vV78p",
      refreshToken:
        "1//04jWwV63XQXJPCgYIARAAGAQSNwF-L9IrF9AiLTYwV_tXcjgfVHKe5WONNA2oPRoXEB3RbCbRpcrYSHZfXq-Jh2ZC7GgATXd5c10",
      accessToken: myAccessToken, //access token variable we defined earlier
    },
  });

  const mailContent = `
  <h2>Please confirm your email</h2>
  <br/>
  <br/>
  <h2><a href=${link}>Click here</a> to activate your email and to login to your dashboard.</h2>
  `;

  const mailOptions = {
    from: "opehardesina@gmail.com", // sender address
    to: company_email, // list of receivers
    subject: "Email Validation", // Subject line
    html: mailContent, // plain text body
  };

  transport.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }
  });
};
