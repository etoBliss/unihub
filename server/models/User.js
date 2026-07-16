import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    // Validate institutional student email: must match example@student.lautech.edu.ng
    match: [
      /^[a-zA-Z0-9._%+-]+@student\.lautech\.edu\.ng$/,
      'Please use your official student email (e.g. username@student.lautech.edu.ng)'
    ],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
  },
  matricNumber: {
    type: String,
    required: [true, 'Matriculation number is required'],
    unique: true,
    trim: true,
  },
  faculty: {
    type: String,
    required: [true, 'Faculty is required'],
    trim: true,
  },
  department: {
    type: String,
    required: [true, 'Academic department is required'],
    trim: true,
  },
  level: {
    type: String,
    required: [true, 'Current level is required'],
    trim: true,
  },
  role: {
    type: String,
    default: 'student',
    enum: ['student'], // Restricted exclusively to student
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
    default: null,
  },
  verificationTokenExpiry: {
    type: Date,
    default: null,
  },
}, { timestamps: true });

// Pre-save hook to hash password (Mongoose v9 compatible — no `next` in async hooks)
UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', UserSchema);
