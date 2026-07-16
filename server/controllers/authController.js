import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Helper to sign token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'super_secret_unihub_jwt_key_2026_ogb', {
    expiresIn: '30d',
  });
};

export const registerUser = async (req, res) => {
  const { name, email, password, matricNumber, faculty, department, level } = req.body;

  try {
    if (!matricNumber || !faculty || !department || !level) {
      return res.status(400).json({ message: 'Matriculation number, Faculty, Department, and Level are required fields' });
    }

    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const matricExists = await User.findOne({ matricNumber });
    if (matricExists) {
      return res.status(400).json({ message: 'User with this matriculation number already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      matricNumber,
      faculty,
      department,
      level,
      role: 'student',
    });

    if (user) {
      return res.status(201).json({
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
    } else {
      return res.status(400).json({ message: 'Invalid registration parameters' });
    }
  } catch (error) {
    return res.status(500).json({ message: `Student registration error: ${error.message}` });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      matricNumber: user.matricNumber,
      department: user.department,
      level: user.level,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    return res.status(500).json({ message: `Login error: ${error.message}` });
  }
};

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

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } }).select('name email role department level matricNumber');
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ message: `Directory query failed: ${error.message}` });
  }
};
