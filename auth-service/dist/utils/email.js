"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEMail = void 0;
const nodemailer = require("nodemailer");
require("dotenv").config();
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    service: "gmail",
    auth: { user: process.env.SMTP_MAIL, pass: process.env.SMTP_PASSWORD },
});
const sendEMail = (subject, token, destEmail) => {
    const message = {
        from: process.env.SMTP_MAIL,
        to: destEmail,
        subject: subject,
        text: token,
    };
    transporter.sendMail(message, function (err, info) {
        if (err) {
            console.log("email errors");

            // console.log({ err });
        }
        else {
            // console.log({ info });

        }
    });
};
exports.sendEMail = sendEMail;
