const Author = require('../models/authorModel');
const Book = require('../models/bookModel');
const cloudinary = require('../config/cloudinary');
const multer = require('multer');

// Multer storage configuration
const storage = multer.memoryStorage();
const upload = multer({ storage }).single('image');

// Controller methods for /api/authors

// Get all authors
exports.getAllAuthors = async (req, res) => {
  try {
    const authors = await Author.find();
    res.json(authors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get an author by ID
exports.getAuthorById = async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }
    res.json(author);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new author
exports.createAuthor = async (req, res) => {
  try {
    // Check if the author already exists
    const existingAuthor = await Author.findOne({ name: req.body.name });
    if (existingAuthor) {
      return res.status(400).json({ error: 'Author already exists' });
    }

    // Upload image to Cloudinary
    const image = req.file;
    if (!image) {
      return res.status(400).json({ error: 'Image is required' });
    }
    
    const uploadedImage = await cloudinary.uploader.upload(image.path);
    req.body.image = uploadedImage.secure_url;

    const author = new Author(req.body);
    const savedAuthor = await author.save();
    res.status(201).json(savedAuthor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update an author
exports.updateAuthor = async (req, res) => {
  try {
    let updateData = { ...req.body };

    // Check if there is a new image to upload
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'authors'
      });
      updateData.image = result.secure_url;
    }

    const updatedAuthor = await Author.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updatedAuthor) {
      return res.status(404).json({ message: 'Author not found' });
    }
    res.json(updatedAuthor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// Delete an author
exports.deleteAuthor = async (req, res) => {
    try {
      const authorId = req.params.id;
  
      // Delete associated books
      await Book.deleteMany({ author: authorId });
  
      // Delete author
      const deletedAuthor = await Author.findByIdAndDelete(authorId);
      if (!deletedAuthor) {
        return res.status(404).json({ message: 'Author not found' });
      }
  
      res.json({ message: 'Author and associated books deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
