import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import logger from './logger';
import eventsRouter from './routes/events';
import usersRouter from './routes/users';
import ordersRouter from './routes/orders';
import paymentsRouter from './routes/payments';

const app = express();
const PORT = 3000;

// Helmet
app.use(helmet());

// CORS
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

// Rate Limiting global
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: 'Muitas requisições, tente novamente em 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Rate Limiting para auth
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Muitas tentativas de login, tente novamente em 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// HPP
app.use(hpp());

// Body parser
app.use(express.json({ limit: '10kb' }));

// Logger de requisições
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path} — IP: ${req.ip}`);
  next();
});

app.get('/', (req, res) => {
  res.json({ message: 'FestFlow API rodando!', version: '1.0.0' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/users', authLimiter, usersRouter);
app.use('/events', eventsRouter);
app.use('/orders', ordersRouter);
app.use('/payments', paymentsRouter);

// Handler de erros global
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error(`Erro: ${err.message} — ${req.method} ${req.path}`);
  res.status(500).json({ message: 'Erro interno do servidor' });
});

app.listen(PORT, () => {
  logger.info(`Servidor rodando em http://localhost:${PORT}`);
});