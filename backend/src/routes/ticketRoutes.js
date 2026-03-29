import express from 'express';
import {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
  getUserTickets,
} from '../controllers/ticketController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/roleMiddleware.js';
import {
  validateTicket,
  handleValidationErrors,
} from '../middleware/validation.js';

const router = express.Router();

// All ticket routes require authentication
router.use(authMiddleware);

// Create ticket
router.post('/', validateTicket, handleValidationErrors, createTicket);

// Get user's own tickets
router.get('/user/my-tickets', getUserTickets);

// Get all tickets (Admin only)
router.get('/', adminOnly, getTickets);

// Get single ticket
router.get('/:id', getTicketById);

// Update ticket (Admin only)
router.put('/:id', adminOnly, validateTicket, handleValidationErrors, updateTicket);

// Delete ticket (Admin only)
router.delete('/:id', adminOnly, deleteTicket);

export default router;
