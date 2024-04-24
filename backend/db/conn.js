const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.set('strictQuery', false);
    await mongoose.connect(process.env.ATLAS_URI);
    console.log('MongoDB Connected!');
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = connectDB;
