import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide client name'],
      trim: true,
    },
    company: {
      type: String,
      required: [true, 'Please provide company name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide email'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    contact: {
      type: String,
      required: [true, 'Please provide contact number'],
    },
    planType: {
      type: String,
      enum: ['Starter', 'Professional', 'Enterprise'],
      default: 'Starter',
    },
    subscriptionStatus: {
      type: String,
      enum: ['Active', 'Inactive', 'Suspended'],
      default: 'Active',
    },
    address: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
clientSchema.index({ email: 1 });
clientSchema.index({ company: 1 });
clientSchema.index({ subscriptionStatus: 1 });

const Client = mongoose.model('Client', clientSchema);
export default Client;
