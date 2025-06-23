const jwt = require('jsonwebtoken');
const { User } = require('../models');

exports.protect = async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      req.user = await User.findByPk(decoded.id, {
        attributes: { exclude: ['password', 'resetToken', 'resetTokenExpires'] }
      });

      next();
    } catch (error) {
      console.error('Authentication error:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Middleware to check if user is an admin of a band
exports.bandAdmin = async (req, res, next) => {
  try {
    const bandId = req.params.bandId || req.body.bandId;
    
    if (!bandId) {
      return res.status(400).json({ message: 'Band ID is required' });
    }

    const membership = await BandMember.findOne({
      where: { bandId, userId: req.user.id }
    });

    if (!membership || membership.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized, band admin role required' });
    }

    next();
  } catch (error) {
    console.error('Band admin check error:', error);
    res.status(500).json({ message: 'Server error checking band admin status' });
  }
};