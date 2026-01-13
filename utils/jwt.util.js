require('dotenv').config();

const jwt = require('jsonwebtoken');

function createJWTToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRETKEY, {
        expiresIn: '8h'
    });
}

const verifyJWT = (req, res, next) => {
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

        req.auth = decoded; // ✅ store decoded payload

        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

//module.exports = verifyJWT;


module.exports = { createJWTToken, verifyJWT };
