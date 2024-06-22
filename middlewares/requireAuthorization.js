const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const JWT_SECRET = 'your-jwt-secret-key';

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized, there is no token' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Unauthorized, error' });
        }
        req.user = decoded; // store the decoded token data (userId, username, userType) in req.user
        next();
    });
};

exports.verifyToken = verifyToken;

exports.isAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        User.findById(req.user.userId)
            .then(user => {
                if (!user || user.userType !== 'admin') {
                    return res.status(403).json({ error: 'Forbidden - Admin access required' });
                }
                next();
            })
            .catch(err => {
                console.error('Error finding user:', err);
                res.status(500).json({ error: 'Internal Server Error' });
            });
    });
};

exports.isClient = (req, res, next) => {
    verifyToken(req, res, () => {
        User.findById(req.user.userId)
            .then(user => {
                if (!user || user.userType !== 'client') {
                    return res.status(403).json({ error: 'Forbidden - Client access required' });
                }
                next();
            })
            .catch(err => {
                console.error('Error finding user:', err);
                res.status(500).json({ error: 'Internal Server Error' });
            });
    });
};

exports.isLivreur = (req, res, next) => {
    verifyToken(req, res, () => {
        User.findById(req.user.userId)
            .then(user => {
                if (!user || user.userType !== 'livreur') {
                    return res.status(403).json({ error: 'Forbidden - Livreur access required' });
                }
                next();
            })
            .catch(err => {
                console.error('Error finding user:', err);
                res.status(500).json({ error: 'Internal Server Error' });
            });
    });
};
