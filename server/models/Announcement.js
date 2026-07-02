import mongoose from 'mongoose';

const AnnouncementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Announcement title is required'],
    trim: true,
  },
  content: {
    type: String,
    required: [true, 'Announcement content is required'],
    trim: true,
  },
  author: {
    type: String,
    default: 'System Admin',
  },
  targetDepartment: {
    type: String,
    default: 'All', // 'All', or specific e.g., 'Computer Science'
  },
  targetLevel: {
    type: String,
    default: 'All', // 'All', or specific level e.g., '100', '200'
  },
}, { timestamps: true });

export default mongoose.model('Announcement', AnnouncementSchema);
