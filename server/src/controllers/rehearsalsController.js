const { Rehearsal, Band, BandMember, Venue, Attendance, User } = require('../models');

// Get all rehearsals for a band
exports.getBandRehearsals = async (req, res) => {
  try {
    const { bandId } = req.params;

    // Check if user is a member of the band
    const membership = await BandMember.findOne({
      where: { bandId, userId: req.user.id }
    });

    if (!membership) {
      return res.status(403).json({ message: 'Not authorized to view rehearsals for this band' });
    }

    const rehearsals = await Rehearsal.findAll({
      where: { bandId },
      include: [
        {
          model: Venue,
          as: 'venue'
        },
        {
          model: Attendance,
          as: 'attendance',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'firstName', 'lastName']
            }
          ]
        }
      ],
      order: [['startTime', 'ASC']]
    });

    res.json(rehearsals);
  } catch (error) {
    console.error('Get band rehearsals error:', error);
    res.status(500).json({ message: 'Server error while fetching rehearsals' });
  }
};

// Get a specific rehearsal by ID
exports.getRehearsalById = async (req, res) => {
  try {
    const rehearsal = await Rehearsal.findByPk(req.params.id, {
      include: [
        {
          model: Band,
          as: 'band'
        },
        {
          model: Venue,
          as: 'venue'
        },
        {
          model: Attendance,
          as: 'attendance',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'firstName', 'lastName']
            }
          ]
        }
      ]
    });

    if (!rehearsal) {
      return res.status(404).json({ message: 'Rehearsal not found' });
    }

    // Check if user is a member of the band
    const membership = await BandMember.findOne({
      where: { bandId: rehearsal.bandId, userId: req.user.id }
    });

    if (!membership) {
      return res.status(403).json({ message: 'Not authorized to view this rehearsal' });
    }

    res.json(rehearsal);
  } catch (error) {
    console.error('Get rehearsal by ID error:', error);
    res.status(500).json({ message: 'Server error while fetching rehearsal' });
  }
};

// Create a new rehearsal
exports.createRehearsal = async (req, res) => {
  try {
    const { bandId, venueId, title, description, startTime, endTime, isRecurring, recurrencePattern } = req.body;

    // Check if user is a member of the band with admin role
    const membership = await BandMember.findOne({
      where: { bandId, userId: req.user.id }
    });

    if (!membership || membership.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to create rehearsals for this band' });
    }

    // Create the rehearsal
    const rehearsal = await Rehearsal.create({
      bandId,
      venueId,
      title,
      description,
      startTime,
      endTime,
      isRecurring,
      recurrencePattern,
      createdBy: req.user.id
    });

    // Get all band members
    const bandMembers = await BandMember.findAll({
      where: { bandId }
    });

    // Create attendance records for all band members
    const attendancePromises = bandMembers.map(member => {
      return Attendance.create({
        rehearsalId: rehearsal.id,
        userId: member.userId,
        status: 'maybe'
      });
    });

    await Promise.all(attendancePromises);

    // Fetch the complete rehearsal with associations
    const completeRehearsal = await Rehearsal.findByPk(rehearsal.id, {
      include: [
        {
          model: Venue,
          as: 'venue'
        },
        {
          model: Attendance,
          as: 'attendance',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'firstName', 'lastName']
            }
          ]
        }
      ]
    });

    res.status(201).json(completeRehearsal);
  } catch (error) {
    console.error('Create rehearsal error:', error);
    res.status(500).json({ message: 'Server error while creating rehearsal' });
  }
};

// Update a rehearsal
exports.updateRehearsal = async (req, res) => {
  try {
    const { title, description, venueId, startTime, endTime, isRecurring, recurrencePattern } = req.body;
    const rehearsal = await Rehearsal.findByPk(req.params.id);

    if (!rehearsal) {
      return res.status(404).json({ message: 'Rehearsal not found' });
    }

    // Check if user is a member of the band with admin role
    const membership = await BandMember.findOne({
      where: { bandId: rehearsal.bandId, userId: req.user.id }
    });

    if (!membership || membership.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this rehearsal' });
    }

    // Update the rehearsal
    rehearsal.title = title || rehearsal.title;
    rehearsal.description = description !== undefined ? description : rehearsal.description;
    rehearsal.venueId = venueId || rehearsal.venueId;
    rehearsal.startTime = startTime || rehearsal.startTime;
    rehearsal.endTime = endTime || rehearsal.endTime;
    rehearsal.isRecurring = isRecurring !== undefined ? isRecurring : rehearsal.isRecurring;
    rehearsal.recurrencePattern = recurrencePattern !== undefined ? recurrencePattern : rehearsal.recurrencePattern;

    await rehearsal.save();

    // Fetch the updated rehearsal with associations
    const updatedRehearsal = await Rehearsal.findByPk(rehearsal.id, {
      include: [
        {
          model: Venue,
          as: 'venue'
        },
        {
          model: Attendance,
          as: 'attendance',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'firstName', 'lastName']
            }
          ]
        }
      ]
    });

    res.json(updatedRehearsal);
  } catch (error) {
    console.error('Update rehearsal error:', error);
    res.status(500).json({ message: 'Server error while updating rehearsal' });
  }
};

// Delete a rehearsal
exports.deleteRehearsal = async (req, res) => {
  try {
    const rehearsal = await Rehearsal.findByPk(req.params.id);

    if (!rehearsal) {
      return res.status(404).json({ message: 'Rehearsal not found' });
    }

    // Check if user is a member of the band with admin role
    const membership = await BandMember.findOne({
      where: { bandId: rehearsal.bandId, userId: req.user.id }
    });

    if (!membership || membership.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this rehearsal' });
    }

    // Delete the rehearsal
    await rehearsal.destroy();

    res.json({ message: 'Rehearsal deleted successfully' });
  } catch (error) {
    console.error('Delete rehearsal error:', error);
    res.status(500).json({ message: 'Server error while deleting rehearsal' });
  }
};

// Update attendance for a rehearsal
exports.updateAttendance = async (req, res) => {
  try {
    const { status, comment } = req.body;
    const { rehearsalId } = req.params;

    // Find the rehearsal
    const rehearsal = await Rehearsal.findByPk(rehearsalId);

    if (!rehearsal) {
      return res.status(404).json({ message: 'Rehearsal not found' });
    }

    // Check if user is a member of the band
    const membership = await BandMember.findOne({
      where: { bandId: rehearsal.bandId, userId: req.user.id }
    });

    if (!membership) {
      return res.status(403).json({ message: 'Not authorized to update attendance for this rehearsal' });
    }

    // Find or create attendance record
    let attendance = await Attendance.findOne({
      where: { rehearsalId, userId: req.user.id }
    });

    if (attendance) {
      // Update existing attendance record
      attendance.status = status;
      attendance.comment = comment !== undefined ? comment : attendance.comment;
      attendance.respondedAt = new Date();
      await attendance.save();
    } else {
      // Create new attendance record
      attendance = await Attendance.create({
        rehearsalId,
        userId: req.user.id,
        status,
        comment,
        respondedAt: new Date()
      });
    }

    // Get all attendance records for the rehearsal
    const allAttendance = await Attendance.findAll({
      where: { rehearsalId },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'firstName', 'lastName']
      }]
    });

    res.json({
      rehearsalId,
      attendance: allAttendance
    });
  } catch (error) {
    console.error('Update attendance error:', error);
    res.status(500).json({ message: 'Server error while updating attendance' });
  }
};