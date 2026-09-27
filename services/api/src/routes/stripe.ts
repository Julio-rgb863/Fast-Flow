import { Router } from 'express';
import { StripeController } from '../controllers/StripeController';
import { authenticate } from '../middleware/auth';

const router = Router();
const stripeController = new StripeController();

router.post('/checkout', authenticate, stripeController.createCheckoutSession);
router.post('/confirm', authenticate, stripeController.confirmPayment);

export default router;
