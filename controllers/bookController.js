const Book = require('../models/bookModel');
const Author = require('../models/authorModel');
const Genre = require('../models/genreModel')

const cloudinary = require('../config/cloudinary');
const multer = require('multer');

// Multer storage configuration
const storage = multer.memoryStorage();
const upload = multer({ storage }).single('image');

// Controller methods for /api/books

// Get all books
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().populate('author', 'name').populate('genre', 'name');
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a book by ID
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate('author', 'name').populate('genre', 'name');;
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//create new book
exports.createBook = async (req, res) => {
  try {
      console.log('Received request to create a book:', req.body);

      // Find the author by name
      const author = await Author.findOne({ name: req.body.author });
      if (!author) {
          console.log('Author not found:', req.body.author);
          return res.status(400).json({ error: 'Author not found' });
      }
      console.log('Found author:', author);

      // Find the genre by name
      const genre = await Genre.findOne({ name: req.body.genre });
      if (!genre) {
          console.log('Genre not found:', req.body.genre);
          return res.status(400).json({ error: 'Genre not found' });
      }
      console.log('Found genre:', genre);

      // Check if the ISBN already exists
      const existingISBN = await Book.findOne({ isbn: req.body.isbn });
      if (existingISBN) {
          console.log('A book with the same ISBN already exists:', req.body.isbn);
          return res.status(400).json({ error: 'A book with the same ISBN already exists' });
      }

      // Check if the title already exists
      const existingTitle = await Book.findOne({ title: req.body.title });
      if (existingTitle) {
          console.log('A book with the same title already exists:', req.body.title);
          return res.status(400).json({ error: 'A book with the same title already exists' });
      }

      // Upload image to Cloudinary
      console.log('Uploading image to Cloudinary...');
      const result = await cloudinary.uploader.upload(req.file.path);
      console.log('Image uploaded to Cloudinary:', result.secure_url);

      // Create the book
      const book = new Book({
          title: req.body.title,
          author: author._id, // Assign the author's ID
          isbn: req.body.isbn,
          publicationDate: req.body.publicationDate,
          genre: genre._id, // Assign the genre's ID
          price: req.body.price,
          stockQuantity: req.body.stockQuantity,
          image: result.secure_url // Assign the Cloudinary image URL
      });

      const savedBook = await book.save();
      console.log('Book saved:', savedBook);
      res.status(201).json(savedBook);
  } catch (error) {
      console.error('Error creating book:', error);
      res.status(400).json({ error: error.message });
  }
};


  
  // Update a book
  exports.updateBook = async (req, res) => {
    try {
      const { author, genre } = req.body;
      let updateData = { ...req.body };
  
      // Check if the referenced author exists
      if (author) {
        const authorExists = await Author.findById(author);
        if (!authorExists) {
          return res.status(400).json({ error: 'Author not found' });
        }
      }
  
      // Check if the referenced genre exists
      if (genre) {
        const genreExists = await Genre.findById(genre);
        if (!genreExists) {
          return res.status(400).json({ error: 'Genre not found' });
        }
      }
  
      // Check if there is a new image to upload
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'books'
        });
        updateData.image = result.secure_url;
      }
  
      // Update the book
      const updatedBook = await Book.findByIdAndUpdate(req.params.id, updateData, { new: true });
      if (!updatedBook) {
        return res.status(404).json({ message: 'Book not found' });
      }
      res.json(updatedBook);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

// Delete a book
exports.deleteBook = async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.searchBooks = async (req, res) => {
    try {
      const { query } = req.body;
      const filter = {};
  
      // Build the filter object based on the provided query
      if (query) {
        const regex = new RegExp(query, 'i'); // Case-insensitive regex pattern
        filter.$or = [
          { title: regex }, // Search by book title
          { author: { $in: await getAuthorIds(query) } }, // Search by author name
          { genre: { $in: await getGenreIds(query) } } // Search by genre name
        ];
      }
  
      // Query books based on the filter
      const books = await Book.find(filter);
  
      res.json(books);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  async function getAuthorIds(name) {
    const authors = await Author.find({ name: new RegExp(name, 'i') }, '_id');
    return authors.map(author => author._id);
  }
  
  async function getGenreIds(name) {
    const genres = await Genre.find({ name: new RegExp(name, 'i') }, '_id');
    return genres.map(genre => genre._id);
  }