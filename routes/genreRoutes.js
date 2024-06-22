const express = require('express');
const router = express.Router();
const genreController = require('../controllers/genreController');
const {isAdmin} = require('../middlewares/requireAuthorization')

// Routes for /api/genres
router.get('/', genreController.getAllGenres);
router.get('/:id', genreController.getGenreById);
router.post('/', isAdmin, genreController.createGenre);
router.put('/:id', isAdmin, genreController.updateGenre);
router.delete('/:id',isAdmin, genreController.deleteGenre);

module.exports = router;
