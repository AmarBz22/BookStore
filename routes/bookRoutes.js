const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const { isAdmin } = require('../middlewares/requireAuthorization');
const multer = require('multer');

// Set up multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// Routes for /api/books
router.get('/', bookController.getAllBooks);
router.get('/:id', bookController.getBookById);
router.post('/', isAdmin, upload.single('image'), bookController.createBook);
router.put('/:id', isAdmin,upload.single('image'), bookController.updateBook);
router.delete('/:id', isAdmin, bookController.deleteBook);


// Route for searching and filtering books
router.post('/search', bookController.searchBooks);

module.exports = router;
