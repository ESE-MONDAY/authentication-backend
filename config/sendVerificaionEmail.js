const nodemailer = require('nodemailer');
require("dotenv").config(); 

const sendVerificationEmail = async (email, token) => {
    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        host: process.env.EMAIL_SERVICE_HOST,
        secure: false,
        port: process.env.EMAIL_SERVICE_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    // Email content
    const mailOptions = {
        from: 'mondayese8@gmail.com',
        to: email,
        subject: 'Email Verification',
        html: `
            <p>Here is your verification code:</p>
            <p><strong>${token}</strong></p>
            <p>Please enter this code in the verification form.</p>
        `
    };

    await transporter.sendMail(mailOptions);
};

module.exports =  sendVerificationEmail ;
