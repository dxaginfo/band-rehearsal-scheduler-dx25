const { Band, User, BandMember } = require('../models');

// Get all bands for the current user
exports.getUserBands = async (req, res) => {
  try {
    const bands = await Band.findAll({
      include: [{
        model: User,
        as: 'members',
        through: { attributes: ['role', 'instruments'] }
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json(bands);
  } catch (error) {
    console.error('Get user bands error:', error);
    res.status(500).json({ message: 'Server error while fetching bands' });
  }
};

// Get a specific band by ID
exports.getBandById = async (req, res) => {
  try {
    const band = await Band.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'members',
        through: { attributes: ['role', 'instruments'] }
      }]
    });

    if (!band) {
      return res.status(404).json({ message: 'Band not found' });
    }

    // Check if user is a member of the band
    const isMember = band.members.some(member => member.id === req.user.id);
    if (!isMember) {
      return res.status(403).json({ message: 'Not authorized to view this band' });
    }

    res.json(band);
  } catch (error) {
    console.error('Get band by ID error:', error);
    res.status(500).json({ message: 'Server error while fetching band' });
  }
};

// Create a new band
exports.createBand = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Create the band
    const band = await Band.create({
      name,
      description,
      createdBy: req.user.id
    });

    // Add the creator as an admin member
    await BandMember.create({
      bandId: band.id,
      userId: req.user.id,
      role: 'admin'
    });

    res.status(201).json(band);
  } catch (error) {
    console.error('Create band error:', error);
    res.status(500).json({ message: 'Server error while creating band' });
  }
};

// Update a band
exports.updateBand = async (req, res) => {
  try {
    const { name, description } = req.body;
    const band = await Band.findByPk(req.params.id);

    if (!band) {
      return res.status(404).json({ message: 'Band not found' });
    }

    // Check if user is an admin of the band
    const membership = await BandMember.findOne({
      where: { bandId: band.id, userId: req.user.id }
    });

    if (!membership || membership.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this band' });
    }

    // Update the band
    band.name = name || band.name;
    band.description = description || band.description;
    await band.save();

    res.json(band);
  } catch (error) {
    console.error('Update band error:', error);
    res.status(500).json({ message: 'Server error while updating band' });
  }
};

// Delete a band
exports.deleteBand = async (req, res) => {
  try {
    const band = await Band.findByPk(req.params.id);

    if (!band) {
      return res.status(404).json({ message: 'Band not found' });
    }

    // Check if user is an admin of the band
    const membership = await BandMember.findOne({
      where: { bandId: band.id, userId: req.user.id }
    });

    if (!membership || membership.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this band' });
    }

    // Delete the band
    await band.destroy();

    res.json({ message: 'Band deleted successfully' });
  } catch (error) {
    console.error('Delete band error:', error);
    res.status(500).json({ message: 'Server error while deleting band' });
  }
};

// Add a member to a band
exports.addMember = async (req, res) => {
  try {
    const { email, role, instruments } = req.body;
    const band = await Band.findByPk(req.params.id);

    if (!band) {
      return res.status(404).json({ message: 'Band not found' });
    }

    // Check if user is an admin of the band
    const membership = await BandMember.findOne({
      where: { bandId: band.id, userId: req.user.id }
    });

    if (!membership || membership.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to add members to this band' });
    }

    // Find the user to add
    const userToAdd = await User.findOne({ where: { email } });
    if (!userToAdd) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user is already a member
    const existingMembership = await BandMember.findOne({
      where: { bandId: band.id, userId: userToAdd.id }
    });

    if (existingMembership) {
      return res.status(400).json({ message: 'User is already a member of this band' });
    }

    // Add the user to the band
    const newMembership = await BandMember.create({
      bandId: band.id,
      userId: userToAdd.id,
      role: role || 'member',
      instruments
    });

    res.status(201).json(newMembership);
  } catch (error) {
    console.error('Add member error:', error);
    res.status(500).json({ message: 'Server error while adding member' });
  }
};