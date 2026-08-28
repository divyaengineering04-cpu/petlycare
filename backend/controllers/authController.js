import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { runQuery, getOne } from '../config/db.js';
import crypto from 'node:crypto';
import { sendVerificationEmail } from '../services/emailService.js';

const generateToken = (userId, email) => {
  return jwt.sign({ id: userId, email }, process.env.JWT_SECRET || 'petcare_super_secret_jwt_key_2026', {
    expiresIn: '30d'
  });
};

export const register = async (req, res) => {
  try {
    const { name, email, phone, password, address, avatar } = req.body;

    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    if (!name || !normalizedEmail || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }
    if (typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const existingUser = await getOne('SELECT * FROM users WHERE LOWER(email) = LOWER(?)', [normalizedEmail]);
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userId = `usr_${Date.now()}`;
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenHash = crypto.createHash('sha256').update(verificationToken).digest('hex');
    const verificationTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    const userAvatar = avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300';
    const createdAt = new Date().toISOString().split('T')[0];

    await runQuery(
      `INSERT INTO users (id, name, email, phone, password, address, avatar, createdAt, emailVerified, verificationTokenHash, verificationTokenExpiresAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, name.trim(), normalizedEmail, phone || '', hashedPassword, address || '', userAvatar, createdAt, 0, verificationTokenHash, verificationTokenExpiresAt]
    );

    const verificationUrl = `${process.env.APP_URL || `http://localhost:${process.env.PORT || 3000}`}/api/auth/verify-email?token=${verificationToken}`;
    const emailSent = await sendVerificationEmail(normalizedEmail, verificationUrl);

    return res.status(201).json({
      message: emailSent ? 'Account created. Check your email to verify your account.' : 'Account created. Verify your email before logging in.',
      requiresEmailVerification: true,
      ...(process.env.NODE_ENV !== 'production' ? { verificationUrl } : {})
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    let user = await getOne('SELECT * FROM users WHERE LOWER(email) = LOWER(?)', [normalizedEmail]);

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (!user.emailVerified) {
      return res.status(403).json({ message: 'Please verify your email before logging in' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user.id, user.email);

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        avatar: user.avatar,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error during login', error: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const token = typeof req.query.token === 'string' ? req.query.token : '';
    if (!token) return res.status(400).json({ message: 'Verification token is required' });

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const user = await getOne('SELECT id FROM users WHERE verificationTokenHash = ? AND verificationTokenExpiresAt > ?', [tokenHash, new Date().toISOString()]);
    if (!user) return res.status(400).json({ message: 'Verification link is invalid or expired' });

    await runQuery('UPDATE users SET emailVerified = 1, verificationTokenHash = NULL, verificationTokenExpiresAt = NULL WHERE id = ?', [user.id]);
    return res.json({ message: 'Email verified successfully. You can now log in.' });
  } catch (error) {
    console.error('Email verification error:', error);
    return res.status(500).json({ message: 'Server error verifying email' });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await getOne('SELECT id, name, email, phone, address, avatar, createdAt FROM users WHERE id = ?', [req.user.id]);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json(user);
  } catch (error) {
    console.error('GetMe error:', error);
    return res.status(500).json({ message: 'Server error fetching user profile' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, phone, address, avatar } = req.body;
    const userId = req.user.id;

    const user = await getOne('SELECT * FROM users WHERE id = ?', [userId]);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updatedName = name || user.name;
    const updatedPhone = phone !== undefined ? phone : user.phone;
    const updatedAddress = address !== undefined ? address : user.address;
    const updatedAvatar = avatar || user.avatar;

    await runQuery(
      `UPDATE users SET name = ?, phone = ?, address = ?, avatar = ? WHERE id = ?`,
      [updatedName, updatedPhone, updatedAddress, updatedAvatar, userId]
    );

    return res.json({
      id: userId,
      name: updatedName,
      email: user.email,
      phone: updatedPhone,
      address: updatedAddress,
      avatar: updatedAvatar,
      createdAt: user.createdAt
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({ message: 'Server error updating profile' });
  }
};
