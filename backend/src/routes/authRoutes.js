import express from 'express';
import {
  register,
  login,
  getProfile,
} from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import {
  validateRegister,
  validateLogin,
  handleValidationErrors,
} from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.post('/register', validateRegister, handleValidationErrors, register);
router.post('/login', validateLogin, handleValidationErrors, login);

// Protected routes
router.get('/profile', authMiddleware, getProfile);

export default router;
