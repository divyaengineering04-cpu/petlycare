import express from 'express';
import { getPets, getPetById, addPet, updatePet, deletePet } from '../controllers/petController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getPets);
router.get('/:id', getPetById);
router.post('/', addPet);
router.put('/:id', updatePet);
router.delete('/:id', deletePet);

export default router;
