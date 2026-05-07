import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class EventController {
  async getAll(req: Request, res: Response) {
    const events = await prisma.event.findMany();
    res.json(events);
  }

  async getById(req: Request, res: Response) {
    const id = req.params.id as string;
    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) return res.status(404).json({ message: 'Evento não encontrado' });
    res.json(event);
  }

  async create(req: Request, res: Response) {
    const { name, description, date, location, totalTickets, price } = req.body;
    const event = await prisma.event.create({
      data: { name, description, date: new Date(date), location, totalTickets, price }
    });
    res.status(201).json(event);
  }

  async update(req: Request, res: Response) {
    const id = req.params.id as string;
    const event = await prisma.event.update({
      where: { id },
      data: req.body
    });
    res.json(event);
  }

  async delete(req: Request, res: Response) {
    const id = req.params.id as string;
    await prisma.event.delete({ where: { id } });
    res.json({ message: 'Evento deletado com sucesso' });
  }
}