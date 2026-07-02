import express from 'express';
import { registerUser, loginUser, getMe, getUsers } from '../controllers/authController.js';
import { authenticateJWT } from '../middleware/authenticateJWT.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', authenticateJWT, getMe);
router.get('/users', authenticateJWT, getUsers);

export default router;
