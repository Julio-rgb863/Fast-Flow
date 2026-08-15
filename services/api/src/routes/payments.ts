import { Router } from 'express';
import { PaymentController } from '../controllers/PaymentController';
import { authenticate } from '../middleware/auth';

const router = Router();
const paymentController = new PaymentController();

router.post('/pix', authenticate, paymentController.createPixPayment);
router.get('/status/:paymentId', authenticate, paymentController.checkPaymentStatus);

export default router; 
