const express = require('express');
const router = express.Router();
const authorController = require('../controllers/authorController');
const {isAdmin} = require('../middlewares/requireAuthorization')
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
// Routes for /api/authors
router.get('/getAuthors', authorController.getAllAuthors);
router.get('/:id', authorController.getAuthorById);
router.post('/creatAuthor',isAdmin,upload.single('image'),authorController.createAuthor);
router.put('/updateAuthoe/:id',isAdmin, upload.single('image'),authorController.updateAuthor);
router.delete('/deletAuthor/:id',isAdmin,authorController.deleteAuthor);

module.exports = router;
