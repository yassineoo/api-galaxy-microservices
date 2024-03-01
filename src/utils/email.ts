const nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.Auth_email,
      pass: process.env.App_password,
    },
  });

export const sendEMail=(subject:string,token:string,destEmail:string)=>{
    const message = {
        from: process.env.Auth_email,
        to: destEmail,
        subject: subject,
        text: token,
      };
      transporter.sendMail(message, function (err:any, info:any) {
        if (err) {
          console.log(err);
        } else {
          console.log(info);
        }
      });
}