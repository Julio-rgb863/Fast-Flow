import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'festflow_secret';

export class UserController {
  async register(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;

      const userExists = await prisma.user.findUnique({ where: { email } });
      if (userExists) {
        return res.status(400).json({ message: 'Email ja cadastrado' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: { name, email, password: hashedPassword }
      });

      return res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email
      });
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao criar usuario' });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(401).json({ message: 'Email ou senha invalidos' });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Email ou senha invalidos' });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.json({
        token,
        user: { id: user.id, name: user.name, email: user.email }
      });
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao fazer login' });
    }
  }
}