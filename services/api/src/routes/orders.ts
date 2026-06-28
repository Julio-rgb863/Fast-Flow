import { Router } from 'express';
import { OrderController } from '../controllers/OrderController';
import { authenticate } from '../middleware/auth';

const router = Router();
const orderController = new OrderController();

router.post('/', authenticate, orderController.create);
router.get('/my-orders', authenticate, orderController.getMyOrders);

export default router;