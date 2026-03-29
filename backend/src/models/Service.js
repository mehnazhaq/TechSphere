import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide service name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide service description'],
    },
    pricing: {
      type: Number,
      required: [true, 'Please provide pricing'],
      min: [0, 'Pricing cannot be negative'],
    },
    activeStatus: {
      type: Boolean,
      default: true,
    },
    category: {
      type: String,
      enum: ['Cloud', 'Security', 'Infrastructure', 'Support', 'Development', 'Other'],
      default: 'Other',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
serviceSchema.index({ name: 1 });
serviceSchema.index({ activeStatus: 1 });
serviceSchema.index({ createdBy: 1 });

const Service = mongoose.model('Service', serviceSchema);
export default Service;
