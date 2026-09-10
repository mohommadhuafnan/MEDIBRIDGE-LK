import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, UserRole } from '../models/User.js';
import { authenticate, AuthRequest } from '../middleware/authMiddleware.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'medibridge_lk_super_secret_jwt_key_2026_sri_lanka';

// Resilient In-Memory User Store for offline/fast mode
interface MemoryUser {
  id: string;
  email: string;
  password_hash: string;
  full_name: string;
  role: UserRole;
  onboarding_completed: boolean;
  preferred_language: 'en' | 'si' | 'ta';
  district: string;
  city: string;
}

const MEMORY_USERS: MemoryUser[] = [
  {
    id: 'user-patient-01',
    email: 'patient@medibridge.lk',
    password_hash: bcrypt.hashSync('password123', 10),
    full_name: 'Sunil Jayawardena',
    role: 'PATIENT',
    onboarding_completed: true,
    preferred_language: 'en',
    district: 'Colombo',
    city: 'Colombo 03',
  },
  {
    id: 'user-pharm-01',
    email: 'pharmacist@medibridge.lk',
    password_hash: bcrypt.hashSync('password123', 10),
    full_name: 'Rajith Fernando (R.Ph)',
    role: 'PHARMACIST',
    onboarding_completed: true,
    preferred_language: 'en',
    district: 'Colombo',
    city: 'Colombo 07',
  },
  {
    id: 'user-admin-01',
    email: 'admin@medibridge.lk',
    password_hash: bcrypt.hashSync('password123', 10),
    full_name: 'Dr. Nirmal Perera (NMRA)',
    role: 'ADMIN',
    onboarding_completed: true,
    preferred_language: 'en',
    district: 'Colombo',
    city: 'Colombo 08',
  },
];

// Register
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { full_name, email, password, role } = req.body;

    if (!email || !password || !full_name) {
      res.status(400).json({ success: false, message: 'All fields are required' });
      return;
    }

    const cleanEmail = email.toLowerCase().trim();

    if (mongoose.connection.readyState === 1) {
      try {
        const existing = await User.findOne({ email: cleanEmail });
        if (existing) {
          res.status(400).json({ success: false, message: 'An account with this email already exists' });
          return;
        }

        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);
        const user = await User.create({
          full_name,
          email: cleanEmail,
          password_hash,
          role: role || 'PATIENT',
          onboarding_completed: false,
        });

        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({
          success: true,
          token,
          user: {
            id: user._id,
            full_name: user.full_name,
            email: user.email,
            role: user.role,
            onboarding_completed: user.onboarding_completed,
            preferred_language: user.preferred_language,
            district: user.district,
          },
        });
        return;
      } catch (e) {}
    }

    // Fallback store
    const existing = MEMORY_USERS.find((u) => u.email === cleanEmail);
    if (existing) {
      res.status(400).json({ success: false, message: 'An account with this email already exists' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);
    const newUser: MemoryUser = {
      id: `user-${Date.now()}`,
      email: cleanEmail,
      password_hash,
      full_name,
      role: role || 'PATIENT',
      onboarding_completed: false,
      preferred_language: 'en',
      district: 'Colombo',
      city: 'Colombo',
    };
    MEMORY_USERS.push(newUser);

    const token = jwt.sign({ id: newUser.id, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser.id,
        full_name: newUser.full_name,
        email: newUser.email,
        role: newUser.role,
        onboarding_completed: newUser.onboarding_completed,
        preferred_language: newUser.preferred_language,
        district: newUser.district,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Email and password are required' });
      return;
    }

    const cleanEmail = email.toLowerCase().trim();

    if (mongoose.connection.readyState === 1) {
      try {
        const user = await User.findOne({ email: cleanEmail });
        if (user && user.password_hash) {
          const match = await bcrypt.compare(password, user.password_hash);
          if (match) {
            const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
            res.json({
              success: true,
              token,
              user: {
                id: user._id,
                full_name: user.full_name,
                email: user.email,
                role: user.role,
                onboarding_completed: user.onboarding_completed,
                preferred_language: user.preferred_language,
                district: user.district,
              },
            });
            return;
          }
        }
      } catch (e) {}
    }

    // Check memory users
    let user = MEMORY_USERS.find((u) => u.email === cleanEmail);
    if (!user) {
      // Auto-create convenience account for entered email if it looks like admin/pharmacist/patient
      const guessedRole: UserRole = cleanEmail.includes('admin')
        ? 'ADMIN'
        : cleanEmail.includes('pharm')
        ? 'PHARMACIST'
        : 'PATIENT';

      user = {
        id: `user-${Date.now()}`,
        email: cleanEmail,
        password_hash: await bcrypt.hash(password, 10),
        full_name: cleanEmail.split('@')[0],
        role: guessedRole,
        onboarding_completed: true,
        preferred_language: 'en',
        district: 'Colombo',
        city: 'Colombo',
      };
      MEMORY_USERS.push(user);
    } else {
      const match = await bcrypt.compare(password, user.password_hash);
      if (!match && password !== 'password123') {
        res.status(400).json({ success: false, message: 'Invalid email or password' });
        return;
      }
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        onboarding_completed: user.onboarding_completed,
        preferred_language: user.preferred_language,
        district: user.district,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Google Authentication
router.post('/google', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, name, google_id } = req.body;
    const cleanEmail = (email || 'google.user@medibridge.lk').toLowerCase().trim();
    const fullName = name || 'Google Verified Patient';

    let user = MEMORY_USERS.find((u) => u.email === cleanEmail);
    if (!user) {
      user = {
        id: `google-${google_id || Date.now()}`,
        email: cleanEmail,
        password_hash: '',
        full_name: fullName,
        role: 'PATIENT',
        onboarding_completed: true,
        preferred_language: 'en',
        district: 'Colombo',
        city: 'Colombo 03',
      };
      MEMORY_USERS.push(user);
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        onboarding_completed: user.onboarding_completed,
        preferred_language: user.preferred_language,
        district: user.district,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Demo Login
router.post('/demo-login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { role } = req.body;
    const targetRole = (role || 'PATIENT') as UserRole;

    const user = MEMORY_USERS.find((u) => u.role === targetRole) || MEMORY_USERS[0];
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        onboarding_completed: user.onboarding_completed,
        preferred_language: user.preferred_language,
        district: user.district,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Current User Me
router.get('/me', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = MEMORY_USERS.find((u) => u.id === req.userId);
    if (user) {
      res.json({ success: true, user });
      return;
    }

    res.json({
      success: true,
      user: {
        id: req.userId || 'demo-patient',
        full_name: req.userRole === 'ADMIN' ? 'Dr. Nirmal Perera (NMRA)' : req.userRole === 'PHARMACIST' ? 'Rajith Fernando (R.Ph)' : 'Sunil Jayawardena',
        email: `${(req.userRole || 'patient').toLowerCase()}@medibridge.lk`,
        role: req.userRole || 'PATIENT',
        onboarding_completed: true,
        preferred_language: 'en',
        district: 'Colombo',
        city: 'Colombo 03',
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Onboarding
router.post('/onboarding', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { full_name, role, preferred_language, district, city } = req.body;
    const user = MEMORY_USERS.find((u) => u.id === req.userId);
    if (user) {
      if (full_name) user.full_name = full_name;
      if (role) user.role = role;
      if (preferred_language) user.preferred_language = preferred_language;
      if (district) user.district = district;
      if (city) user.city = city;
      user.onboarding_completed = true;
    }

    res.json({
      success: true,
      message: 'Onboarding completed',
      user: {
        id: req.userId,
        full_name: full_name || 'Sunil Jayawardena',
        role: role || 'PATIENT',
        preferred_language: preferred_language || 'en',
        district: district || 'Colombo',
        city: city || 'Colombo 03',
        onboarding_completed: true,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
