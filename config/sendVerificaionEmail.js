
const nodemailer = require('nodemailer');

const sendVerificationEmail = async (email, token) => {
    // Create a nodemailer transporter using your email service provider credentials
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'mondayese8@gmail.com',
            pass: 'Petroleum2'
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

module.exports = { sendVerificationEmail };
