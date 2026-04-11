const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a ticket title'],
      trim: true,
      maxlength: [150, 'Title cannot be more than 150 characters']
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [2000, 'Description cannot be more than 2000 characters']
    },
    status: {
      type: String,
      enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
      default: 'Open'
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium'
    },
    category: {
      type: String,
      enum: ['Technical', 'Billing', 'General', 'Feature Request', 'Bug'],
      default: 'General'
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Ticket must belong to a user']
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    resolution: {
      type: String,
      maxlength: [1000, 'Resolution cannot be more than 1000 characters'],
      default: null
    }
  },
  {
    timestamps: true  // Adds createdAt and updatedAt automatically
  }
);

// Index for faster queries by status and userId
ticketSchema.index({ status: 1, userId: 1 });

module.exports = mongoose.model('Ticket', ticketSchema);
