const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a client name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  company: {
    type: String,
    required: [true, 'Please add a company name'],
    trim: true,
    maxlength: [100, 'Company name cannot be more than 100 characters']
  },
  contactNumber: {
    type: String,
    required: [true, 'Please add a contact number'],
    match: [/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/, 'Please add a valid phone number']
  },
  planType: {
    type: String,
    enum: ['Basic', 'Standard', 'Premium', 'Enterprise'],
    default: 'Basic'
  },
  subscriptionStatus: {
    type: String,
    enum: ['Active', 'Inactive', 'Suspended', 'Trial'],
    default: 'Trial'
  },
  address: {
    type: String,
    maxlength: [200, 'Address cannot be more than 200 characters']
  },
  // Link to user account if client has one
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Client', clientSchema);
