// pages/api/auth/verify-code.js

let verificationCodes = {}; // Should match the same used in the send-code API

export default async function handler(req, res) {
    const { email, code } = req.body;

    if (verificationCodes[email] === code) {
        delete verificationCodes[email]; // Clear the code after successful verification
        res.status(200).json({ success: true });
    } else {
        res.status(400).json({ success: false, message: 'Invalid code' });
    }
}
