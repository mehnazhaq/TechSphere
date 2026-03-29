import Ticket from '../models/Ticket.js';

// Create ticket
export const createTicket = async (req, res, next) => {
  try {
    const { title, description, clientId, priority } = req.body;

    const newTicket = new Ticket({
      title,
      description,
      userId: req.userId,
      clientId,
      priority,
      status: 'Open',
    });

    await newTicket.save();
    await newTicket.populate('userId', 'name email');
    await newTicket.populate('clientId', 'name company');

    res.status(201).json({
      success: true,
      message: 'Ticket created successfully',
      statusCode: 201,
      data: newTicket,
    });
  } catch (error) {
    next(error);
  }
};

// Get all tickets
export const getTickets = async (req, res, next) => {
  try {
    const tickets = await Ticket.find()
      .populate('userId', 'name email')
      .populate('clientId', 'name company')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Tickets fetched successfully',
      statusCode: 200,
      data: tickets,
    });
  } catch (error) {
    next(error);
  }
};

// Get single ticket
export const getTicketById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const ticket = await Ticket.findById(id)
      .populate('userId', 'name email')
      .populate('clientId', 'name company')
      .populate('assignedTo', 'name email');

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found',
        statusCode: 404,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Ticket fetched successfully',
      statusCode: 200,
      data: ticket,
    });
  } catch (error) {
    next(error);
  }
};

// Update ticket
export const updateTicket = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // If status is being changed to Resolved, set resolvedAt
    if (updates.status === 'Resolved') {
      updates.resolvedAt = new Date();
    }

    // If status is being changed to Closed, set closedAt
    if (updates.status === 'Closed') {
      updates.closedAt = new Date();
    }

    const updatedTicket = await Ticket.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    })
      .populate('userId', 'name email')
      .populate('clientId', 'name company')
      .populate('assignedTo', 'name email');

    if (!updatedTicket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found',
        statusCode: 404,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Ticket updated successfully',
      statusCode: 200,
      data: updatedTicket,
    });
  } catch (error) {
    next(error);
  }
};

// Delete ticket
export const deleteTicket = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedTicket = await Ticket.findByIdAndDelete(id);

    if (!deletedTicket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found',
        statusCode: 404,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Ticket deleted successfully',
      statusCode: 200,
    });
  } catch (error) {
    next(error);
  }
};

// Get user's tickets
export const getUserTickets = async (req, res, next) => {
  try {
    const tickets = await Ticket.find({ userId: req.userId })
      .populate('userId', 'name email')
      .populate('clientId', 'name company')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'User tickets fetched successfully',
      statusCode: 200,
      data: tickets,
    });
  } catch (error) {
    next(error);
  }
};
