const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    dose: {
      type: String,
      default: '',
      trim: true,
    },
    frequency: {
      type: String,
      default: '',
      trim: true,
    },
    notes: {
      type: String,
      default: '',
      trim: true,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model('Medicine', medicineSchema);


