require("dotenv").config(); // load das variáveis de ambiente
const nodeMailer = require('nodemailer');

/**
 * mmpc rrlw dbwd qaks
 */
const emailUtil = {};

emailUtil.sendMail = async (to, subject, html) => {
    const transporter = nodeMailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })

    const info = await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: to,
        subject: subject,
        html: html
    })

    return info;
}

emailUtil.sendMails = async (toArray, subject, html) => {
    const transporter = nodeMailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })

    const info= await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: toArray,
        subject: subject,
        html: html
    })

    console.log(info.accepted);
    console.log(info.rejected);

    return info;
}

module.exports = emailUtil;