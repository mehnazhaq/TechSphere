import express from 'express';
import {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
} from '../controllers/serviceController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/roleMiddleware.js';
import {
  validateService,
  handleValidationErrors,
} from '../middleware/validation.js';

const router = express.Router();

// All service routes require authentication
router.use(authMiddleware);

// Create service (Admin only)
router.post('/', adminOnly, validateService, handleValidationErrors, createService);

// Get all services
router.get('/', getServices);

// Get single service
router.get('/:id', getServiceById);

// Update service (Admin only)
router.put('/:id', adminOnly, validateService, handleValidationErrors, updateService);

// Delete service (Admin only)
router.delete('/:id', adminOnly, deleteService);

export default router;
