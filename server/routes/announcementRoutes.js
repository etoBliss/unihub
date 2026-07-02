import express from 'express';
import { createAnnouncement, getAnnouncements, getAnnouncementById, deleteAnnouncement } from '../controllers/announcementController.js';
import { authenticateJWT } from '../middleware/authenticateJWT.js';
import { verifyAdminApiKey } from '../middleware/verifyAdminApiKey.js';

const router = express.Router();

// Secure creation route using the Admin Key instead of student JWT
router.post('/', verifyAdminApiKey, createAnnouncement);
router.get('/', authenticateJWT, getAnnouncements);
router.get('/:id', authenticateJWT, getAnnouncementById);
router.delete('/:id', verifyAdminApiKey, deleteAnnouncement); // Secure deletions as well

export default router;
