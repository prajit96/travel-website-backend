// middleware/auth.js
// const jwt = require('jsonwebtoken');

// module.exports = function (req, res, next) {
//   const token = req.header('Authorization').split(' ')[1];
//   if (!token) return res.status(401).send('No token, authorization denied');

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     if (decoded.role !== 'admin') return res.status(403).send('Access denied');
//     req.user = decoded;
//     next();
//   } catch (err) {
//     res.status(401).send('Token is not valid');
//   }
// };
// middleware/auth.js

// const jwt = require('jsonwebtoken');

// module.exports = function (req, res, next) {
//   const authHeader = req.header('Authorization');
//   if (!authHeader) return res.status(401).send('No token, authorization denied');
  
//   const token = authHeader.split(' ')[1];
//   if (!token) return res.status(401).send('No token, authorization denied');

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (err) {
//     res.status(401).send('Token is not valid');
//   }
// };

const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Assuming User model exists

const auth = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Get token from Authorization header

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach the decoded user info to the request object
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = auth;

