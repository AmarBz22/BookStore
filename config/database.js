const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // MongoDB connection string
    const mongoURI = 'mongodb+srv://amarbouzida62:1234@cluster0.somhczk.mongodb.net/';

    // Connect to MongoDB
    await mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 200000, // Increase timeout to 50 seconds

      });

    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    // Retry the connection after a delay (e.g., 5 seconds)
  }
};

module.exports = connectDB;
