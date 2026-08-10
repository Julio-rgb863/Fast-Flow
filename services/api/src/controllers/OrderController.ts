import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

const createOrderSchema = z.object({
  eventId: z.string().uuid({ message: 'eventId inválido' }),
  quantity: z.number().int().positive({ message: 'Quantidade deve ser positiva' }),
});

const cancelOrderParamsSchema = z.object({
  id: z.string().uuid({ message: 'ID inválido' }),
});

export class OrderController {
  async create(req: AuthRequest, res: Response) {
    try {
      const parsed = createOrderSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ errors: parsed.error.format() });

      const { eventId, quantity } = parsed.data;
      const userId = req.userId as string;

      const order = await prisma.$transaction(async (tx) => {
        const event = await tx.event.findUnique({ where: { id: eventId } });
        if (!event) throw new Error('EVENTO_NAO_ENCONTRADO');

        const ingressosDisponiveis = event.totalTickets - event.soldTickets;
        if (quantity > ingressosDisponiveis) throw new Error('INGRESSOS_INSUFICIENTES');

        const total = event.price * quantity;
        const newOrder = await tx.order.create({
          data: { userId, eventId, quantity, total },
          include: { event: true },
        });

        await tx.event.update({
          where: { id: eventId },
          data: { soldTickets: { increment: quantity } },
        });

        return newOrder;
      });

      return res.status(201).json(order);
    } catch (error: any) {
      if (error.message === 'EVENTO_NAO_ENCONTRADO') return res.status(404).json({ message: 'Evento não encontrado' });
      if (error.message === 'INGRESSOS_INSUFICIENTES') return res.status(400).json({ message: 'Ingressos insuficientes' });
      return res.status(500).json({ message: 'Erro ao criar pedido' });
    }
  }

  async getMyOrders(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId as string;
      const orders = await prisma.order.findMany({
        where: { userId },
        include: {
          event: { select: { id: true, name: true, date: true, location: true, price: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
      return res.json(orders);
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao buscar pedidos' });
    }
  }

  async cancelOrder(req: AuthRequest, res: Response) {
    try {
      const parsedParams = cancelOrderParamsSchema.safeParse(req.params);
      if (!parsedParams.success) return res.status(400).json({ errors: parsedParams.error.format() });

      const { id } = parsedParams.data;
      const userId = req.userId as string;

      await prisma.$transaction(async (tx) => {
        const order = await tx.order.findUnique({ where: { id } });
        if (!order) throw new Error('PEDIDO_NAO_ENCONTRADO');
        if (order.userId !== userId) throw new Error('SEM_PERMISSAO');
        if (order.status === 'cancelled') throw new Error('JA_CANCELADO');

        await tx.order.update({ where: { id }, data: { status: 'cancelled' } });
        await tx.event.update({
          where: { id: order.eventId },
          data: { soldTickets: { decrement: order.quantity } },
        });
      });

      return res.json({ message: 'Pedido cancelado com sucesso' });
    } catch (error: any) {
      if (error.message === 'PEDIDO_NAO_ENCONTRADO') return res.status(404).json({ message: 'Pedido não encontrado' });
      if (error.message === 'SEM_PERMISSAO') return res.status(403).json({ message: 'Sem permissão para cancelar este pedido' });
      if (error.message === 'JA_CANCELADO') return res.status(400).json({ message: 'Pedido já foi cancelado' });
      return res.status(500).json({ message: 'Erro ao cancelar pedido' });
    }
  }
}