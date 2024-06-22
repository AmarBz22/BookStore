const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const JWT_SECRET = 'your-jwt-secret-key'; // Make sure to use a strong secret key and store it securely

const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: 'Invalid User Name' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        // Include username in the token payload
        const tokenPayload = {
            userId: user._id,
            username: user.username, // Include username
            userType: user.userType
        };

        const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '24h' });
        res.json({ message: `Welcome ${user.username}`, token, userType: user.userType });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


const register = async (req, res) => {
    const { username, email, password, userType } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword, userType });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const logout = (req, res) => {
    // No action needed for token-based logout
    res.status(200).json({ message: 'Logout successful' });
};

const session = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user: { username: user.username, userType: user.userType } });
    } catch (error) {
        console.error('Error fetching session user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    login,
    register,
    logout,
    session
};
