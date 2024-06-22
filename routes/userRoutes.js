const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');

// User registration route
router.post('/register', UserController.register);

// User login route
router.post('/login', UserController.login);

// User logout route
router.post('/logout', UserController.logout);
// User session test
router.get('/session', UserController.session);


module.exports = router;
