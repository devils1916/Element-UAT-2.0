const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ message: 'Authorization header missing' });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Token missing' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRETKEY);

        // 🔑 REQUIRED
        req.auth = decoded;

        next();
    } catch (error) {
        console.error('JWT error:', error.message);
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports = authMiddleware;
