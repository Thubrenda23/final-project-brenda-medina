const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri =
      process.env.MONGODB_URI ||
      'mongodb+srv://bcm:vilcare@vilcare.dr0ijnv.mongodb.net/?appName=Vilcare';
    if (!uri) {
      console.error('MONGODB_URI is not set; no fallback URI available.');
      process.exit(1);
    }
    await mongoose.connect(uri);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;


