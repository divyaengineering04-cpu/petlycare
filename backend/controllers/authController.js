import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { runQuery, getOne } from '../config/db.js';

const generateToken = (userId, email) => {
  return jwt.sign(
    { id: userId, email },
    process.env.JWT_SECRET || 'petcare_super_secret_jwt_key_2026',
    {
      expiresIn: '30d'
    }
  );
};

// =========================
// REGISTER
// =========================
export const register = async (req, res) => {
  try {
    const { name, email, phone, password, address, avatar } = req.body;

    const normalizedEmail =
      typeof email === 'string'
        ? email.trim().toLowerCase()
        : '';

    // Validate required fields
    if (!name || !normalizedEmail || !password) {
      return res.status(400).json({
        message: 'Name, email, and password are required'
      });
    }

    // Validate email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return res.status(400).json({
        message: 'Please provide a valid email address'
      });
    }

    // Validate password
    if (typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters'
      });
    }

    // Check if user already exists
    const existingUser = await getOne(
      'SELECT * FROM users WHERE LOWER(email) = LOWER(?)',
      [normalizedEmail]
    );

    if (existingUser) {
      return res.status(400).json({
        message: 'User with this email already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user ID
    const userId = `usr_${Date.now()}`;

    // Default avatar
    const userAvatar =
      avatar ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300';

    // Created date
    const createdAt = new Date().toISOString().split('T')[0];

    // Insert user
    await runQuery(
      `INSERT INTO users
      (id, name, email, phone, password, address, avatar, createdAt, emailVerified)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        name.trim(),
        normalizedEmail,
        phone || '',
        hashedPassword,
        address || '',
        userAvatar,
        createdAt,
        1
      ]
    );

    return res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: userId,
        name: name.trim(),
        email: normalizedEmail,
        phone: phone || '',
        address: address || '',
        avatar: userAvatar,
        createdAt
      }
    });

  } catch (error) {
    console.error('Register error:', error);

    return res.status(500).json({
      message: 'Server error during registration',
      error: error.message
    });
  }
};


// =========================
// LOGIN
// =========================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate fields
    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required'
      });
    }

    const normalizedEmail =
      typeof email === 'string'
        ? email.trim().toLowerCase()
        : '';

    // Find user
    const user = await getOne(
      'SELECT * FROM users WHERE LOWER(email) = LOWER(?)',
      [normalizedEmail]
    );

    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    // Generate JWT
    const token = generateToken(
      user.id,
      user.email
    );

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

    return res.status(500).json({
      message: 'Server error during login',
      error: error.message
    });
  }
};


// =========================
// GET CURRENT USER
// =========================
export const getMe = async (req, res) => {
  try {
    const user = await getOne(
      `SELECT id, name, email, phone, address, avatar, createdAt
       FROM users
       WHERE id = ?`,
      [req.user.id]
    );

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    return res.json(user);

  } catch (error) {
    console.error('GetMe error:', error);

    return res.status(500).json({
      message: 'Server error fetching user profile'
    });
  }
};


// =========================
// UPDATE PROFILE
// =========================
export const updateProfile = async (req, res) => {
  try {
    const { name, phone, address, avatar } = req.body;

    const userId = req.user.id;

    const user = await getOne(
      'SELECT * FROM users WHERE id = ?',
      [userId]
    );

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    const updatedName = name || user.name;
    const updatedPhone =
      phone !== undefined ? phone : user.phone;
    const updatedAddress =
      address !== undefined ? address : user.address;
    const updatedAvatar =
      avatar || user.avatar;

    await runQuery(
      `UPDATE users
       SET name = ?, phone = ?, address = ?, avatar = ?
       WHERE id = ?`,
      [
        updatedName,
        updatedPhone,
        updatedAddress,
        updatedAvatar,
        userId
      ]
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

    return res.status(500).json({
      message: 'Server error updating profile'
    });
  }
};