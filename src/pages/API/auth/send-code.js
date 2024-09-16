// pages/api/auth/send-code.js
import nodemailer from 'nodemailer';

let verificationCodes = {}; // Store codes temporarily, ideally use Redis or another persistent store

export default async function handler(req, res) {
    const { email } = req.body;

    // Generate a random verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    verificationCodes[email] = code;

    // Use nodemailer to send email
    const transporter = nodemailer.createTransport({
        service: 'gmail', // or any other service
        auth: {
            user: process.env.EMAIL_USER, // Your email
            pass: process.env.EMAIL_PASS, // Your password
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your Verification Code',
        text: `Your verification code is ${code}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to send verification email' });
    }
}
