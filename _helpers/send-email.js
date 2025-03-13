require('dotenv').config();
const nodemailer = require('nodemailer');
const config = require('config.json');

module.exports = sendEmail;

async function sendEmail({ to, subject, html, from = config.emailFrom }) {
    const transporter = nodemailer.createTransport({
        ...config.smtpOptions,
        auth: {
            user: process.env.SMTP_USER,  
            pass: process.env.SMTP_PASS
        }
    });

    await transporter.sendMail({ from, to, subject, html });
}
