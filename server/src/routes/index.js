const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const bandRoutes = require('./bandRoutes');
const rehearsalRoutes = require('./rehearsalRoutes');
const venueRoutes = require('./venueRoutes');
const resourceRoutes = require('./resourceRoutes');

// Route groups
router.use('/auth', authRoutes);
router.use('/bands', bandRoutes);
router.use('/rehearsals', rehearsalRoutes);
router.use('/venues', venueRoutes);
router.use('/resources', resourceRoutes);

// API health check route
router.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

module.exports = router;