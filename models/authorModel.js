// Assuming you're using Mongoose for MongoDB
const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  biography: String,
  image: {
    type: String,
    required: true
  }
});

const Author = mongoose.model('Author', authorSchema);

module.exports = Author;
