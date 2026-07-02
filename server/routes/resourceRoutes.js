import express from 'express';
import multer from 'multer';
import { uploadResource, getResources, getResourceById, deleteResource } from '../controllers/resourceController.js';
import { authenticateJWT } from '../middleware/authenticateJWT.js';
import { verifyAssetMimetypeAndMetadata } from '../middleware/verifyAsset.js';

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.post('/', authenticateJWT, upload.single('file'), verifyAssetMimetypeAndMetadata, uploadResource);
router.get('/', authenticateJWT, getResources);
router.get('/:id', authenticateJWT, getResourceById);
router.delete('/:id', authenticateJWT, deleteResource);

export default router;
