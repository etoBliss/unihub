import Announcement from '../models/Announcement.js';

export const createAnnouncement = async (req, res) => {
  const { title, content, author, targetDepartment, targetLevel } = req.body;

  try {
    const announcement = new Announcement({
      title,
      content,
      author: author || 'System Admin',
      targetDepartment: targetDepartment || 'All',
      targetLevel: targetLevel || 'All',
    });

    const savedAnnouncement = await announcement.save();
    return res.status(201).json(savedAnnouncement);
  } catch (error) {
    return res.status(500).json({ message: `Create announcement failed: ${error.message}` });
  }
};

export const getAnnouncements = async (req, res) => {
  try {
    const userDept = req.user.department;
    const userLevel = req.user.level;

    // Filter announcements:
    // 1. targetDepartment matches student's department OR is 'All'
    // 2. targetLevel matches student's level OR is 'All'
    const filter = {
      $and: [
        { targetDepartment: { $in: ['All', userDept] } },
        { targetLevel: { $in: ['All', userLevel.toString()] } }
      ]
    };

    const announcements = await Announcement.find(filter).sort({ createdAt: -1 });
    return res.json(announcements);
  } catch (error) {
    return res.status(500).json({ message: `Fetch announcements failed: ${error.message}` });
  }
};

export const getAnnouncementById = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    // Access check for student department & level
    const userDept = req.user.department;
    const userLevel = req.user.level;

    const allowedDept = announcement.targetDepartment === 'All' || announcement.targetDepartment === userDept;
    const allowedLevel = announcement.targetLevel === 'All' || announcement.targetLevel === userLevel.toString();

    if (!allowedDept || !allowedLevel) {
      return res.status(403).json({ message: 'Access to this announcement is restricted' });
    }

    return res.json(announcement);
  } catch (error) {
    return res.status(500).json({ message: `Fetch announcement by ID failed: ${error.message}` });
  }
};

export const deleteAnnouncement = async (req, res) => {
  try {
    // Under student-only model, deletion happens via administrative script with API Key or manually,
    // but in case students attempt it, we block it unless authorized (or restrict it to admin endpoints if we want, but let's keep a simple safety block).
    return res.status(403).json({ message: 'Unauthorized: Students cannot delete system announcements' });
  } catch (error) {
    return res.status(500).json({ message: `Delete announcement failure: ${error.message}` });
  }
};
