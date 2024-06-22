const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/database');
const bookRoutes = require('./routes/bookRoutes');
const authorRoutes = require('./routes/authorRoutes');
const genreRoutes = require('./routes/genreRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');
const errorHandlers = require('./utils/errorHandlers');
const session = require('express-session');
const cors = require('cors');

const app = express();

// Use session middleware
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false, // Change to true if using HTTPS
        maxAge: 86400000 // 24 hours
    }
}));

const corsOptions = {
    origin: 'http://localhost:3000', // Specify the origin you want to allow
    credentials: true, // Allow credentials
};
app.use(cors(corsOptions));

// Middleware
app.use(bodyParser.json());

// Connect Database 
connectDB();

// Routes
app.use('/api/books', bookRoutes);
app.use('/api/authors', authorRoutes);
app.use('/api/genres', genreRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);

// Error Handling Middleware
app.use(errorHandlers.notFound);
app.use(errorHandlers.errorHandler);

// Start the server
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
