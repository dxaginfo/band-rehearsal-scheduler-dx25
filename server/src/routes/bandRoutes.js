const express = require('express');
const router = express.Router();
const { protect, bandAdmin } = require('../middleware/authMiddleware');
const bandsController = require('../controllers/bandsController');

// Get all bands for the current user
router.get('/', protect, bandsController.getUserBands);

// Get a specific band by ID
router.get('/:id', protect, bandsController.getBandById);

// Create a new band
router.post('/', protect, bandsController.createBand);

// Update a band
router.put('/:id', protect, bandsController.updateBand);

// Delete a band
router.delete('/:id', protect, bandsController.deleteBand);

// Add a member to a band
router.post('/:id/members', protect, bandsController.addMember);

module.exports = router;