import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'festflow_secret';

const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

export class UserController {
  async register(req: Request, res: Response) {
    try {
      const parsed = registerSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten().fieldErrors });

      const { name, email, password } = parsed.data;
      const userExists = await prisma.user.findUnique({ where: { email } });
      if (userExists) return res.status(400).json({ message: 'Email já cadastrado' });

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({ data: { name, email, password: hashedPassword } });

      return res.status(201).json({ id: user.id, name: user.name, email: user.email });
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao criar usuário' });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const parsed = loginSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten().fieldErrors });

      const { email, password } = parsed.data;
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) return res.status(401).json({ message: 'Email ou senha inválidos' });

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) return res.status(401).json({ message: 'Email ou senha inválidos' });

      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
      return res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao fazer login' });
    }
  }

  async getProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId as string;
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true, name: true, email: true, createdAt: true,
          orders: { include: { event: true }, orderBy: { createdAt: 'desc' } },
        },
      });
      if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });
      return res.json(user);
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao buscar perfil' });
    }
  }
}