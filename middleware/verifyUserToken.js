const User = require('../models/User');
const jwt = require('jsonwebtoken');
const dotEnv = require('dotenv');

dotEnv.config();
const secretKey = process.env.SECRET_KEY;


const verifyUserToken = async(req, res, next) => {
    const token = req.headers.token;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized - Missing token' });
    }

    try {
        const decoded = jwt.verify(token, secretKey);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Unauthorized - Invalid token' });
    }

}