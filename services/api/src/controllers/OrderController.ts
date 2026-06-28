import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export class OrderController {
  async create(req: AuthRequest, res: Response) {
    try {
      const { eventId, quantity } = req.body;
      const userId = req.userId as string;

      const event = await prisma.event.findUnique({ where: { id: eventId } });
      if (!event) {
        return res.status(404).json({ message: 'Evento nao encontrado' });
      }

      const ingressosDisponiveis = event.totalTickets - event.soldTickets;
      if (quantity > ingressosDisponiveis) {
        return res.status(400).json({ message: 'Ingressos insuficientes' });
      }

      const total = event.price * quantity;

      const order = await prisma.order.create({
        data: { userId, eventId, quantity, total }
      });

      await prisma.event.update({
        where: { id: eventId },
        data: { soldTickets: event.soldTickets + quantity }
      });

      return res.status(201).json(order);
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao criar pedido' });
    }
  }

  async getMyOrders(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId as string;

      const orders = await prisma.order.findMany({
        where: { userId },
        include: { event: true }
      });

      return res.json(orders);
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao buscar pedidos' });
    }
  }
}