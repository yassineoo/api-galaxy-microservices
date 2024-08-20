const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  service: process.env.SMTP_SERVICE,
  auth: { user: process.env.SMTP_MAIL, pass: process.env.SMTP_PASSWORD },
});

export const sendEMail = (
  subject: string,
  token: string,
  destEmail: string
) => {
  const message = {
    from: process.env.SMTP_MAIL,
    to: destEmail,
    subject: subject,
    text: token,
  };
  transporter.sendMail(message, function (err: any, info: any) {
    if (err) {
      console.log("email errors");

      console.log(err);
    } else {
      console.log(info);
    }
  });
};
