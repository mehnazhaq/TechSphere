const express = require('express');
const Ticket = require('../models/Ticket');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

// Apply protect middleware to all ticket routes
router.use(protect);

// ─── POST /api/tickets ────────────────────────────────────────────────────────
// @desc    Submit a new support ticket
// @access  Private (Client only)
router.post('/', authorize('Client'), async (req, res, next) => {
  try {
    // Attach the logged-in user's ID as the ticket owner
    req.body.userId = req.user.id;
    const ticket = await Ticket.create(req.body);
    res.status(201).json({ success: true, data: ticket });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/tickets ─────────────────────────────────────────────────────────
// @desc    View tickets
//          - Admin sees ALL tickets (with optional filters)
//          - Client sees only their own tickets
// @access  Private
router.get('/', async (req, res, next) => {
  try {
    const { status, priority, category } = req.query;
    const filter = {};

    // Non-admin users can only see their own tickets
    if (req.user.role !== 'Admin') {
      filter.userId = req.user.id;
    }

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;

    const tickets = await Ticket.find(filter)
      .populate('userId', 'name email role')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: tickets.length, data: tickets });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/tickets/:id ─────────────────────────────────────────────────────
// @desc    View a single ticket
//          - Admin can view any ticket
//          - Client can only view their own
// @access  Private
router.get('/:id', async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('userId', 'name email role')
      .populate('assignedTo', 'name email');

    if (!ticket) {
      return res.status(404).json({ success: false, error: 'Ticket not found.' });
    }

    // Non-admin can only access their own ticket
    if (req.user.role !== 'Admin' && ticket.userId._id.toString() !== req.user.id.toString()) {
      return res.status(403).json({ success: false, error: 'Not authorized to access this ticket.' });
    }

    res.status(200).json({ success: true, data: ticket });
  } catch (err) {
    next(err);
  }
});

// ─── PUT /api/tickets/:id ─────────────────────────────────────────────────────
// @desc    Update ticket status, priority, resolution, or assignedTo
// @access  Private (Admin only)
router.put('/:id', authorize('Admin'), async (req, res, next) => {
  try {
    const allowedUpdates = ['status', 'priority', 'assignedTo', 'resolution', 'category'];
    const updateData = {};

    // Only allow whitelisted fields to be updated
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) updateData[field] = req.body[field];
    });

    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('userId', 'name email');

    if (!ticket) {
      return res.status(404).json({ success: false, error: 'Ticket not found.' });
    }

    res.status(200).json({ success: true, data: ticket });
  } catch (err) {
    next(err);
  }
});

// ─── DELETE /api/tickets/:id ──────────────────────────────────────────────────
// @desc    Delete or close a ticket
// @access  Private (Admin only)
router.delete('/:id', authorize('Admin'), async (req, res, next) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);
    if (!ticket) {
      return res.status(404).json({ success: false, error: 'Ticket not found.' });
    }
    res.status(200).json({ success: true, message: 'Ticket deleted successfully.', data: {} });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
