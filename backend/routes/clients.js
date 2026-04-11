const express = require('express');
const Client = require('../models/Client');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

// Apply protect middleware to all routes below
router.use(protect);

// ─── POST /api/clients ────────────────────────────────────────────────────────
// @desc    Add a new client
// @access  Private (Admin only)
router.post('/', authorize('Admin'), async (req, res, next) => {
  try {
    const client = await Client.create(req.body);
    res.status(201).json({ success: true, data: client });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/clients ─────────────────────────────────────────────────────────
// @desc    Get all clients with optional filters
// @access  Private (Admin, Technician)
router.get('/', authorize('Admin', 'Technician'), async (req, res, next) => {
  try {
    const { status, plan, search } = req.query;
    const filter = {};

    if (status) filter.subscriptionStatus = status;
    if (plan) filter.planType = plan;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } }
      ];
    }

    const clients = await Client.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: clients.length, data: clients });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/clients/:id ─────────────────────────────────────────────────────
// @desc    Get single client profile
// @access  Private (Admin, Technician)
router.get('/:id', authorize('Admin', 'Technician'), async (req, res, next) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ success: false, error: 'Client not found.' });
    }
    res.status(200).json({ success: true, data: client });
  } catch (err) {
    next(err);
  }
});

// ─── PUT /api/clients/:id ─────────────────────────────────────────────────────
// @desc    Update client details
// @access  Private (Admin only)
router.put('/:id', authorize('Admin'), async (req, res, next) => {
  try {
    const client = await Client.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!client) {
      return res.status(404).json({ success: false, error: 'Client not found.' });
    }
    res.status(200).json({ success: true, data: client });
  } catch (err) {
    next(err);
  }
});

// ─── DELETE /api/clients/:id ──────────────────────────────────────────────────
// @desc    Remove a client
// @access  Private (Admin only)
router.delete('/:id', authorize('Admin'), async (req, res, next) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client) {
      return res.status(404).json({ success: false, error: 'Client not found.' });
    }
    res.status(200).json({ success: true, message: 'Client removed successfully.', data: {} });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
