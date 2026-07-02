import express from 'express';
import { sendMessage, getConversation, getInbox } from '../controllers/messageController.js';
import { authenticateJWT } from '../middleware/authenticateJWT.js';

const router = express.Router();

router.post('/', authenticateJWT, sendMessage);
router.get('/inbox', authenticateJWT, getInbox);
router.get('/conversation/:userId', authenticateJWT, getConversation);

export default router;
