const express = require('express');
const Service = require('../models/Service');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

// ─── GET /api/services ────────────────────────────────────────────────────────
// @desc    Get all available services (with optional filters)
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    const { category, available, search } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (available !== undefined) filter.availabilityStatus = available === 'true';
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const services = await Service.find(filter)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: services.length, data: services });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/services/:id ────────────────────────────────────────────────────
// @desc    Get single service
// @access  Public
router.get('/:id', async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id).populate('createdBy', 'name email');
    if (!service) {
      return res.status(404).json({ success: false, error: 'Service not found.' });
    }
    res.status(200).json({ success: true, data: service });
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/services ───────────────────────────────────────────────────────
// @desc    Add a new service
// @access  Private (Admin only)
router.post('/', protect, authorize('Admin'), async (req, res, next) => {
  try {
    // Attach createdBy from the authenticated user
    req.body.createdBy = req.user.id;
    const service = await Service.create(req.body);
    res.status(201).json({ success: true, data: service });
  } catch (err) {
    next(err);
  }
});

// ─── PUT /api/services/:id ────────────────────────────────────────────────────
// @desc    Update a service
// @access  Private (Admin only)
router.put('/:id', protect, authorize('Admin'), async (req, res, next) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    if (!service) {
      return res.status(404).json({ success: false, error: 'Service not found.' });
    }
    res.status(200).json({ success: true, data: service });
  } catch (err) {
    next(err);
  }
});

// ─── DELETE /api/services/:id ─────────────────────────────────────────────────
// @desc    Delete a service
// @access  Private (Admin only)
router.delete('/:id', protect, authorize('Admin'), async (req, res, next) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, error: 'Service not found.' });
    }
    res.status(200).json({ success: true, message: 'Service deleted successfully.', data: {} });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
