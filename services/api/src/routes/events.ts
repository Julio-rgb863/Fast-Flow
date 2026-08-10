import { Router } from 'express';
import { EventController } from '../controllers/EventController';
import { authenticate } from '../middleware/auth';

const router = Router();
const eventController = new EventController();

router.get('/', eventController.getAll);
router.get('/:id', eventController.getById);
router.post('/', authenticate, eventController.create);
router.put('/:id', authenticate, eventController.update);
router.delete('/:id', authenticate, eventController.delete);

export default router;