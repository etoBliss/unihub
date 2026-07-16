import crypto from 'crypto';
import mongoose from 'mongoose';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { sendVerificationEmail } from '../utils/mailer.js';

// ─── Helpers ────────────────────────────────────────────────────────────────

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET || 'super_secret_unihub_jwt_key_2026_ogb', {
    expiresIn: '30d',
  });

/** Fail-fast guard — returns false and sends 503 if the DB is offline */
const assertDbConnected = (res) => {
  if (mongoose.connection.readyState !== 1) {
    res.status(503).json({
      message:
        'The database is currently unreachable. Please whitelist your IP in MongoDB Atlas and restart the server.',
    });
    return false;
  }
  return true;
};

// ─── Register ────────────────────────────────────────────────────────────────

export const registerUser = async (req, res) => {
  const { name, email, password, matricNumber, faculty, department, level } = req.body;

  try {
    if (!assertDbConnected(res)) return;

    if (!matricNumber || !faculty || !department || !level) {
      return res.status(400).json({
        message: 'Matriculation number, Faculty, Department, and Level are required fields',
      });
    }

    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    if (await User.findOne({ matricNumber })) {
      return res.status(400).json({ message: 'User with this matriculation number already exists' });
    }

    // Generate a cryptographically secure one-time token (expires in 24 h)
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // +24 hours

    const user = await User.create({
      name,
      email,
      password,
      matricNumber,
      faculty,
      department,
      level,
      role: 'student',
      isVerified: false,
      verificationToken,
      verificationTokenExpiry,
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid registration parameters' });
    }

    // Send the verification email (non-blocking — don't crash if mail fails)
    try {
      await sendVerificationEmail(email, name, verificationToken);
    } catch (mailErr) {
      console.error('Verification email failed to send:', mailErr.message);
      // We still return 201 but inform the client that mail may not have arrived
      return res.status(201).json({
        pending: true,
        message:
          'Account created but verification email could not be sent. ' +
          'Contact support or try re-sending from the login page.',
      });
    }

    return res.status(201).json({
      pending: true,
      message: `Verification email sent to ${email}. Please check your inbox and click the link to activate your account.`,
    });
  } catch (error) {
    return res.status(500).json({ message: `Student registration error: ${error.message}` });
  }
};

// ─── Verify Email ─────────────────────────────────────────────────────────────

export const verifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
    if (!assertDbConnected(res)) return;

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpiry: { $gt: new Date() }, // token must not be expired
    });

    if (!user) {
      return res.status(400).json({
        message: 'This verification link is invalid or has expired. Please register again.',
      });
    }

    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpiry = null;
    await user.save();

    return res.status(200).json({
      message: 'Email verified successfully! You can now log in.',
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    return res.status(500).json({ message: `Verification error: ${error.message}` });
  }
};

// ─── Login ───────────────────────────────────────────────────────────────────

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!assertDbConnected(res)) return;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Block unverified accounts
    if (!user.isVerified) {
      return res.status(403).json({
        message:
          'Your email address has not been verified yet. Please check your inbox for the verification link.',
        unverified: true,
      });
    }

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      matricNumber: user.matricNumber,
      faculty: user.faculty,
      department: user.department,
      level: user.level,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    return res.status(500).json({ message: `Login error: ${error.message}` });
  }
};

// ─── Resend Verification ──────────────────────────────────────────────────────

export const resendVerification = async (req, res) => {
  const { email } = req.body;

  try {
    if (!assertDbConnected(res)) return;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'No account found with that email address.' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'This account is already verified. Please log in.' });
    }

    // Issue a fresh token with a new 24-hour window
    user.verificationToken = crypto.randomBytes(32).toString('hex');
    user.verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await user.save();

    await sendVerificationEmail(email, user.name, user.verificationToken);

    return res.status(200).json({
      message: `A new verification link has been sent to ${email}.`,
    });
  } catch (error) {
    return res.status(500).json({ message: `Resend error: ${error.message}` });
  }
};

// ─── Get Me ───────────────────────────────────────────────────────────────────

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User profile not found' });
    }
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: `Fetch student info error: ${error.message}` });
  }
};

// ─── Get Users ────────────────────────────────────────────────────────────────

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } }).select(
      'name email role department level matricNumber'
    );
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ message: `Directory query failed: ${error.message}` });
  }
};
