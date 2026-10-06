import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const createEventSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), 'Data inválida'),
  location: z.string().min(1, 'Local é obrigatório'),
  totalTickets: z.number().int().positive('Total de ingressos deve ser positivo'),
  price: z.number().positive('Preço deve ser positivo'),
});

const promoteUserSchema = z.object({
  role: z.enum(['admin', 'user']).optional().default('admin'),
});

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const [totalUsers, totalEvents, totalOrders, ordersAgg, eventsAgg, recentOrders] = await Promise.all([
      prisma.user.count(),
      prisma.event.count(),
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { status: { not: 'cancelled' } },
      }),
      prisma.event.aggregate({
        _sum: { soldTickets: true },
      }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, name: true, email: true } },
          event: { select: { id: true, name: true } },
        },
      }),
    ]);

    const totalRevenue = ordersAgg._sum.total || 0;
    const totalTicketsSold = eventsAgg._sum.soldTickets || 0;

    return res.json({
      totalUsers,
      totalEvents,
      totalOrders,
      totalRevenue,
      totalTicketsSold,
      recentOrders,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao buscar estatísticas do painel' });
  }
};

export const listUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: { orders: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json(users);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao listar usuários' });
  }
};

export const listAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        event: { select: { id: true, name: true, date: true, location: true, price: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json(orders);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao listar pedidos' });
  }
};

export const createEvent = async (req: Request, res: Response) => {
  try {
    const parsed = createEventSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.flatten().fieldErrors });
    }

    const { name, description, date, location, totalTickets, price } = parsed.data;
    const event = await prisma.event.create({
      data: {
        name,
        description,
        date: new Date(date),
        location,
        totalTickets,
        price,
      },
    });

    return res.status(201).json(event);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao criar evento' });
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const exists = await prisma.event.findUnique({ where: { id } });
    if (!exists) {
      return res.status(404).json({ message: 'Evento não encontrado' });
    }

    await prisma.$transaction([
      prisma.order.deleteMany({ where: { eventId: id } }),
      prisma.event.delete({ where: { id } }),
    ]);

    return res.json({ message: 'Evento deletado com sucesso' });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao deletar evento' });
  }
};

export const promoteUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const userExists = await prisma.user.findUnique({ where: { id } });
    if (!userExists) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const parsed = promoteUserSchema.safeParse(req.body || {});
    const targetRole = parsed.success ? parsed.data.role : 'admin';

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role: targetRole },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });

    return res.json({
      message: `Usuário ${updatedUser.name} agora possui a permissão '${updatedUser.role}'`,
      user: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao atualizar permissão do usuário' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const requestingUserId = (req as any).userId as string;

    if (id === requestingUserId) {
      return res.status(400).json({ message: 'Você não pode excluir sua própria conta.' });
    }

    const userExists = await prisma.user.findUnique({ where: { id } });
    if (!userExists) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    if (userExists.role === 'admin') {
      return res.status(403).json({ message: 'Não é possível excluir outro administrador.' });
    }

    // Remove pedidos do usuário antes de deletar
    await prisma.$transaction([
      prisma.order.deleteMany({ where: { userId: id } }),
      prisma.user.delete({ where: { id } }),
    ]);

    return res.json({ message: `Usuário "${userExists.name}" excluído com sucesso.` });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao excluir usuário' });
  }
};

export class AdminController {
  getDashboardStats = getDashboardStats;
  listUsers = listUsers;
  listAllOrders = listAllOrders;
  createEvent = createEvent;
  deleteEvent = deleteEvent;
  promoteUser = promoteUser;
  deleteUser = deleteUser;
}
