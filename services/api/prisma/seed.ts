import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Admin
  const adminPassword = await bcrypt.hash('Admin@2025!', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'julio@festflow.com' },
    update: { password: adminPassword, role: 'admin' },
    create: {
      name: 'Julio Admin',
      email: 'julio@festflow.com',
      password: adminPassword,
      role: 'admin',
    },
  });
  console.log('✅ Admin criado/atualizado:', admin.email);

  // Eventos de exemplo
  const eventos = [
    {
      name: 'Show de Verão 2025',
      description: 'O maior show do verão com as melhores bandas da cidade.',
      date: new Date('2025-12-20T21:00:00'),
      location: 'Arena Central, São Paulo',
      totalTickets: 500,
      price: 120.0,
    },
    {
      name: 'Festival de Jazz',
      description: 'Uma noite inesquecível com jazz ao vivo no coração da cidade.',
      date: new Date('2025-11-15T19:00:00'),
      location: 'Teatro Municipal, Rio de Janeiro',
      totalTickets: 300,
      price: 85.0,
    },
    {
      name: 'Rock na Praça',
      description: 'Festival gratuito de rock com bandas locais e nacionais.',
      date: new Date('2025-10-30T18:00:00'),
      location: 'Praça da República, Curitiba',
      totalTickets: 1000,
      price: 0.0,
    },
  ];

  for (const evento of eventos) {
    const existing = await prisma.event.findFirst({ where: { name: evento.name } });
    if (!existing) {
      await prisma.event.create({ data: evento });
      console.log('✅ Evento criado:', evento.name);
    } else {
      console.log('⏭️ Evento já existe:', evento.name);
    }
  }

  console.log('\n🎉 Seed finalizado com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
