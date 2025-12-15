const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      default: '',
      trim: true,
    },
    avatarUrl: {
      type: String,
      default: '',
    },
    emergencyContact: {
      type: String,
      default: '',
      trim: true,
    },
    primaryDoctorContact: {
      type: String,
      default: '',
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model('User', userSchema);


