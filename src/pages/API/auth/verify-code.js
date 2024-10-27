import VerificationCode from '../../../models/VerificationCode';
import dbConnect from '../../../utils/dbConnect';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }

  await dbConnect();

  const { email, code } = req.body;
console.log(email, code)
  try {
    const record = await VerificationCode.findOne({ email });
    console.log(record)
    if (!record) {
      return res.status(400).json({ error: 'Verification code expired or not found' });
    }
    if (record.code === code) {
      await VerificationCode.deleteOne({ email });
      return res.status(200).json({ success: true });
    } else {
      return res.status(400).json({ error: 'Invalid verification code' });
    }
  } catch (error) {
    console.error('Error verifying code:', error);
    res.status(500).json({ error: 'Verification failed' });
  }
}
