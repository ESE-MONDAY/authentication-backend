const nodemailer = require('nodemailer');
require("dotenv").config(); 

const tokenEmailMap = new Map();

// Generate token
function generateVerificationToken() {
    return Math.random().toString(36).substring(2,10); // Token expires in 1 hour
  }

const sendVerificationEmail = async (email) => {

    const token = generateVerificationToken()
    tokenEmailMap.set(token, email);
    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        host: process.env.EMAIL_SERVICE_HOST,
        secure: true,
        port: process.env.EMAIL_SERVICE_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    // Email content
    const mailOptions = {
        from: 'ese@nosen.co',
        to: email,
        subject: 'Email Verification ',
        html: `
            <p>Here is your verification code:</p>
            <p><strong>${token}</strong></p>
            <p>Please enter this code in the verification form.</p>
        `
    };

    await transporter.sendMail(mailOptions);
};

module.exports =  sendVerificationEmail ;
