const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  ISBN: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  publisher: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  genre: {
    type: [String], // Changed to array of strings
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
  link: {
    type: String,
    required: true,
  },
  photo: {
    type: String, // Assuming photo is a URL to the thumbnail
    // required: true,
  },
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;