const express = require('express');
const requireAuth = require('../middleware/auth');
const Medicine = require('../models/Medicine');
const Vaccine = require('../models/Vaccine');
const Appointment = require('../models/Appointment');

const router = express.Router();

// All routes below require authentication
router.use(requireAuth);

// Medicines
router.get('/medicines', async (req, res) => {
  const items = await Medicine.find({ userId: req.session.userId }).sort({
    createdAt: -1,
  });
  res.json(items);
});

router.post('/medicines', async (req, res) => {
  try {
    const { name, dose, frequency, notes, startDate, endDate } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Medicine name is required.' });
    }
    const med = await Medicine.create({
      userId: req.session.userId,
      name,
      dose,
      frequency,
      notes,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });
    res.status(201).json(med);
  } catch (err) {
    console.error('Create medicine error:', err.message);
    res.status(500).json({ message: 'Error creating medicine.' });
  }
});

router.delete('/medicines/:id', async (req, res) => {
  try {
    await Medicine.deleteOne({
      _id: req.params.id,
      userId: req.session.userId,
    });
    res.json({ message: 'Medicine deleted.' });
  } catch (err) {
    console.error('Delete medicine error:', err.message);
    res.status(500).json({ message: 'Error deleting medicine.' });
  }
});

// Vaccines
router.get('/vaccines', async (req, res) => {
  const items = await Vaccine.find({ userId: req.session.userId }).sort({
    date: -1,
  });
  res.json(items);
});

router.post('/vaccines', async (req, res) => {
  try {
    const { name, date, provider, notes } = req.body;
    if (!name || !date) {
      return res.status(400).json({ message: 'Vaccine name and date are required.' });
    }
    const item = await Vaccine.create({
      userId: req.session.userId,
      name,
      date: new Date(date),
      provider,
      notes,
    });
    res.status(201).json(item);
  } catch (err) {
    console.error('Create vaccine error:', err.message);
    res.status(500).json({ message: 'Error creating vaccine.' });
  }
});

router.delete('/vaccines/:id', async (req, res) => {
  try {
    await Vaccine.deleteOne({
      _id: req.params.id,
      userId: req.session.userId,
    });
    res.json({ message: 'Vaccine deleted.' });
  } catch (err) {
    console.error('Delete vaccine error:', err.message);
    res.status(500).json({ message: 'Error deleting vaccine.' });
  }
});

// Appointments
router.get('/appointments', async (req, res) => {
  const items = await Appointment.find({ userId: req.session.userId }).sort({
    date: 1,
  });
  res.json(items);
});

router.post('/appointments', async (req, res) => {
  try {
    const { doctor, date, location, reason, notes } = req.body;
    if (!doctor || !date) {
      return res
        .status(400)
        .json({ message: 'Doctor and date are required for an appointment.' });
    }
    const item = await Appointment.create({
      userId: req.session.userId,
      doctor,
      date: new Date(date),
      location,
      reason,
      notes,
    });
    res.status(201).json(item);
  } catch (err) {
    console.error('Create appointment error:', err.message);
    res.status(500).json({ message: 'Error creating appointment.' });
  }
});

router.delete('/appointments/:id', async (req, res) => {
  try {
    await Appointment.deleteOne({
      _id: req.params.id,
      userId: req.session.userId,
    });
    res.json({ message: 'Appointment deleted.' });
  } catch (err) {
    console.error('Delete appointment error:', err.message);
    res.status(500).json({ message: 'Error deleting appointment.' });
  }
});

module.exports = router;


