 import { Response } from 'express';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

export class StripeController {
  createCheckoutSession = async (req: AuthRequest, res: Response) => {
    try {
      const { orderId } = req.body;
      const userId = req.userId as string;

      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { event: true, user: true },
      });

      if (!order) return res.status(404).json({ message: 'Pedido não encontrado' });
      if (order.userId !== userId) return res.status(403).json({ message: 'Sem permissão' });
      if (order.status !== 'pending') return res.status(400).json({ message: 'Pedido já processado' });

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'brl',
              product_data: {
                name: `${order.event.name}`,
                description: `${order.quantity} ingresso(s) - ${order.event.location}`,
              },
              unit_amount: Math.round(order.total * 100),
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `http://localhost:5173/payment/success?orderId=${order.id}`,
        cancel_url: `http://localhost:5173/payment/cancel`,
        metadata: {
          orderId: order.id,
        },
      });

      return res.json({ url: session.url, sessionId: session.id });
    } catch (error: any) {
      console.log('Erro Stripe:', error.message);
      return res.status(500).json({ message: 'Erro ao criar sessão de pagamento', error: error.message });
    }
  };
} 
