import express from 'express';
import eventsRouter from './routes/events';
import usersRouter from './routes/users';
import ordersRouter from './routes/orders';

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ 
    message: 'FestFlow API rodando!',
    version: '1.0.0'
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

app.use('/events', eventsRouter);
app.use('/users', usersRouter);
app.use('/orders', ordersRouter);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});