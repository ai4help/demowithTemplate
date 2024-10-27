import mongoose from 'mongoose';

const verificationCodeSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  code: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '10m', // Code expires after 10 minutes
  },
});

export default mongoose.models.VerificationCode || mongoose.model('VerificationCode', verificationCodeSchema);
