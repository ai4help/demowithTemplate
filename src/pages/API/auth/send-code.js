import dbConnect from '../../../utils/dbConnect';
import VerificationCode from '../../../models/VerificationCode';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  await dbConnect(); // Ensure MongoDB connection

  const { email } = req.body;

  // Generate a random 6-digit verification code
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  // Dynamically import Nodemailer to avoid client-side bundling issues
  const nodemailer = await import('nodemailer');
  const transporter = nodemailer.createTransport({
    host: 'mail.privateemail.com',  // Replace with your SMTP host
    port: 587,
    secure: false,  // Use true for port 465 (SSL)
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your Verification Code',
    text: `Your verification code is ${code}`,
  };

  try {
    // Send the email with the verification code
    await transporter.sendMail(mailOptions);

    // Upsert (insert or update) the verification code in MongoDB
    await VerificationCode.findOneAndUpdate(
      { email }, // Find an existing document by email
      { email, code, createdAt: new Date() }, // Update or insert email and code
      { upsert: true, new: true, setDefaultsOnInsert: true } // Options to create if doesn't exist
    );

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error sending email or saving to DB:', error);
    res.status(500).json({ error: 'Failed to send verification email or save code' });
  }
}
