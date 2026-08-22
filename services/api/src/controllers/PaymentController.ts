import { Response } from 'express';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export class PaymentController {
  createPixPayment = async (req: AuthRequest, res: Response) => {
    try {
      const { orderId } = req.body;
      const userId = req.userId as string;

      // Inicializa o cliente aqui para garantir que o .env já foi carregado
      const client = new MercadoPagoConfig({
        accessToken: process.env.MP_ACCESS_TOKEN || '',
      });
      const payment = new Payment(client);

      console.log('Token usado:', process.env.MP_ACCESS_TOKEN?.substring(0, 20));

      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { event: true, user: true },
      });

      if (!order) return res.status(404).json({ message: 'Pedido não encontrado' });
      if (order.userId !== userId) return res.status(403).json({ message: 'Sem permissão' });
      if (order.status !== 'pending') return res.status(400).json({ message: 'Pedido já processado' });

      const result = await payment.create({
        body: {
          transaction_amount: order.total,
          description: `FastFlow - ${order.event.name} (${order.quantity} ingresso(s))`,
          payment_method_id: 'pix',
          payer: {
            email: order.user.email,
            first_name: order.user.name,
          },
        },
      });

      return res.status(201).json({
        paymentId: result.id,
        status: result.status,
        qrCode: result.point_of_interaction?.transaction_data?.qr_code,
        qrCodeBase64: result.point_of_interaction?.transaction_data?.qr_code_base64,
        expiresAt: result.date_of_expiration,
      });
    } catch (error: any) {
      console.log('Erro MP detalhado:', JSON.stringify(error?.cause || error?.message || error));
      console.log('Erro completo:', error);
      return res.status(500).json({ message: 'Erro ao criar pagamento', error: error.message });
    }
  };

  checkPaymentStatus = async (req: AuthRequest, res: Response) => {
    try {
      const client = new MercadoPagoConfig({
        accessToken: process.env.MP_ACCESS_TOKEN || '',
      });
      const payment = new Payment(client);

      const { paymentId } = req.params;
      const paymentIdValue = Array.isArray(paymentId) ? paymentId[0] : paymentId;

      if (!paymentIdValue) {
        return res.status(400).json({ message: 'Pagamento não informado' });
      }

      const result = await payment.get({ id: paymentIdValue });

      if (result.status === 'approved') {
        const orderId = result.external_reference;
        if (orderId) {
          await prisma.order.update({
            where: { id: orderId },
            data: { status: 'paid' },
          });
        }
      }

      return res.json({ status: result.status });
    } catch (error: any) {
      console.log('Erro MP status:', JSON.stringify(error?.cause || error?.message || error));
      return res.status(500).json({ message: 'Erro ao verificar pagamento', error: error.message });
    }
  };
}