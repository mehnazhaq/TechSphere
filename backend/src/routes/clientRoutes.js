import express from 'express';
import {
  createClient,
  getClients,
  getClientById,
  updateClient,
  deleteClient,
} from '../controllers/clientController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/roleMiddleware.js';
import {
  validateClient,
  handleValidationErrors,
} from '../middleware/validation.js';

const router = express.Router();

// All client routes require authentication
router.use(authMiddleware);

// Create client (Admin only)
router.post('/', adminOnly, validateClient, handleValidationErrors, createClient);

// Get all clients
router.get('/', getClients);

// Get single client
router.get('/:id', getClientById);

// Update client (Admin only)
router.put('/:id', adminOnly, validateClient, handleValidationErrors, updateClient);

// Delete client (Admin only)
router.delete('/:id', adminOnly, deleteClient);

export default router;
