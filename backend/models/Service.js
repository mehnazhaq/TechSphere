const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a service name'],
    trim: true,
    unique: true,
    maxlength: [100, 'Service name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  pricing: {
    type: Number,
    required: [true, 'Please add a pricing'],
    min: [0, 'Pricing cannot be negative']
  },
  pricingUnit: {
    type: String,
    enum: ['per month', 'per year', 'one-time', 'per user/month'],
    default: 'per month'
  },
  category: {
    type: String,
    enum: ['Cloud', 'Security', 'Networking', 'Support', 'DevOps', 'Analytics', 'Other'],
    default: 'Other'
  },
  availabilityStatus: {
    type: Boolean,
    default: true
  },
  features: {
    type: [String],
    default: []
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update 'updatedAt' on save
serviceSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Service', serviceSchema);
