const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authMiddleware = async (req, res, next) => {
  try {
    // Get the token from the request header
    const token = req.header('Authorization').replace('Bearer ', '');

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user associated with the token
    const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });

    // Throw an error if the user is not found
    if (!user) {
      throw new Error();
    }

    // Set the user and token in the request object for future use
    req.user = user;
    req.token = token;

    // Call the next middleware
    next();
  } catch (err) {
    // Return an error response if authentication fails
    res.status(401).json({ success: false, error: 'Unauthorized' });
  }
};

module.exports = authMiddleware;
