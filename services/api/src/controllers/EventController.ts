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

const updateEventSchema = createEventSchema.partial();

export class EventController {
  getAll = async (req: Request, res: Response) => {
    try {
      const events = await prisma.event.findMany({ orderBy: { date: 'asc' } });
      return res.json(events);
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao buscar eventos' });
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      const event = await prisma.event.findUnique({ where: { id } });
      if (!event) return res.status(404).json({ message: 'Evento não encontrado' });
      return res.json(event);
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao buscar evento' });
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const parsed = createEventSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten().fieldErrors });

      const { name, description, date, location, totalTickets, price } = parsed.data;
      const event = await prisma.event.create({
        data: { name, description, date: new Date(date), location, totalTickets, price },
      });
      return res.status(201).json(event);
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao criar evento' });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      const exists = await prisma.event.findUnique({ where: { id } });
      if (!exists) return res.status(404).json({ message: 'Evento não encontrado' });

      const parsed = updateEventSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten().fieldErrors });

      const data = { ...parsed.data, ...(parsed.data.date && { date: new Date(parsed.data.date) }) };
      const event = await prisma.event.update({ where: { id }, data });
      return res.json(event);
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao atualizar evento' });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      const exists = await prisma.event.findUnique({ where: { id } });
      if (!exists) return res.status(404).json({ message: 'Evento não encontrado' });

      await prisma.event.delete({ where: { id } });
      return res.json({ message: 'Evento deletado com sucesso' });
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao deletar evento' });
    }
  };
}