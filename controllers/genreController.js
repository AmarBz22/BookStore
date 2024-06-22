const Genre = require('../models/genreModel');
const Book = require('../models/bookModel');

// Controller methods for /api/genres

// Get all genres
exports.getAllGenres = async (req, res) => {
  try {
    const genres = await Genre.find();
    res.json(genres);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a genre by ID
exports.getGenreById = async (req, res) => {
  try {
    const genre = await Genre.findById(req.params.id);
    if (!genre) {
      return res.status(404).json({ message: 'Genre not found' });
    }
    res.json(genre);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new genre
exports.createGenre = async (req, res) => {
  try {
      // Check if the genre already exists
      const existingGenre = await Genre.findOne({ name: req.body.name });
      if (existingGenre) {
          return res.status(400).json({ error: 'Genre already exists' });
      }

      const genre = new Genre(req.body);
      const savedGenre = await genre.save();
      res.status(201).json(savedGenre);
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
};


// Update a genre
exports.updateGenre = async (req, res) => {
  try {
    const updatedGenre = await Genre.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedGenre) {
      return res.status(404).json({ message: 'Genre not found' });
    }
    res.json(updatedGenre);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a genre
exports.deleteGenre = async (req, res) => {
    try {
      const genreId = req.params.id;
  
      // Delete associated books
      await Book.deleteMany({ genre: genreId });
  
      // Delete genre
      const deletedGenre = await Genre.findByIdAndDelete(genreId);
      if (!deletedGenre) {
        return res.status(404).json({ message: 'Genre not found' });
      }
  
      res.json({ message: 'Genre and associated books deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
