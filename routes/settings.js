const express = require('express');
const requireAuth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const User = require('../models/User');
const Medicine = require('../models/Medicine');
const Vaccine = require('../models/Vaccine');
const Appointment = require('../models/Appointment');
const SupportMessage = require('../models/SupportMessage');

const router = express.Router();

// Multer storage for avatar uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'public', 'uploads'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, `avatar-${req.session.userId}${ext}`);
  },
});

const upload = multer({ storage });

router.use(requireAuth);

// Delete account and related data
router.delete('/account', async (req, res) => {
  try {
    const userId = req.session.userId;
    await Promise.all([
      User.deleteOne({ _id: userId }),
      Medicine.deleteMany({ userId }),
      Vaccine.deleteMany({ userId }),
      Appointment.deleteMany({ userId }),
      SupportMessage.deleteMany({ userId }),
    ]);

    req.session.destroy(() => {
      res.json({ message: 'Account and data deleted.' });
    });
  } catch (err) {
    console.error('Delete account error:', err.message);
    res.status(500).json({ message: 'Error deleting account.' });
  }
});

// Update profile info (avatar + emergency contacts)
router.post('/avatar', upload.single('avatarFile'), async (req, res) => {
  try {
    const { emergencyContact, primaryDoctorContact } = req.body;

    let avatarUrl = '';
    if (req.file) {
      // Serve from /uploads via the static middleware
      avatarUrl = `/uploads/${req.file.filename}`;
    }

    await User.updateOne(
      { _id: req.session.userId },
      {
        $set: {
          avatarUrl,
          emergencyContact: emergencyContact || '',
          primaryDoctorContact: primaryDoctorContact || '',
        },
      }
    );
    res.json({ message: 'Profile updated.' });
  } catch (err) {
    console.error('Update profile error:', err.message);
    res.status(500).json({ message: 'Error updating profile.' });
  }
});

// Contact support
router.post('/support', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ message: 'Support message is required.' });
    }

    await SupportMessage.create({
      userId: req.session.userId,
      message,
    });

    res.json({ message: 'Support message received.' });
  } catch (err) {
    console.error('Support message error:', err.message);
    res.status(500).json({ message: 'Error sending support message.' });
  }
});

module.exports = router;


