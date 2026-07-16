import express from 'express';
import FACULTIES from '../data/faculties.js';

const router = express.Router();

// GET /api/faculties — Return all faculties with their departments
router.get('/', (req, res) => {
  res.json(FACULTIES);
});

// GET /api/faculties/:facultyId/departments — Return departments for a specific faculty
router.get('/:facultyId/departments', (req, res) => {
  const faculty = FACULTIES.find((f) => f.id === req.params.facultyId);
  if (!faculty) {
    return res.status(404).json({ message: 'Faculty not found' });
  }
  res.json(faculty.departments);
});

export default router;
