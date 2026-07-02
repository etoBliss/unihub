import mongoose from 'mongoose';

const ResourceSchema = new mongoose.Schema({
  courseCode: {
    type: String,
    required: [true, 'Course code is required'],
    trim: true,
  },
  title: {
    type: String,
    required: [true, 'Resource title is required'],
    trim: true,
  },
  url: {
    type: String,
    required: [true, 'File URL is required'],
  },
  fileType: {
    type: String,
    trim: true,
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  approvalStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  verifiedBy: {
    type: String,
    default: 'Verification_Bot',
  },
}, { timestamps: true });

export default mongoose.model('Resource', ResourceSchema);
