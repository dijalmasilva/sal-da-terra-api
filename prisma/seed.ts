import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const role_visitor = await prisma.role.upsert({
    where: { id: 1, name: 'VISITANTE' },
    update: {},
    create: {
      name: 'VISITANTE',
    },
  });

  const role_sheep = await prisma.role.upsert({
    where: { id: 2, name: 'OVELHA' },
    update: {},
    create: {
      name: 'OVELHA',
    },
  });

  const role_leader = await prisma.role.upsert({
    where: { id: 3, name: 'LIDER' },
    update: {},
    create: {
      name: 'LIDER',
    },
  });

  const role_cooperator = await prisma.role.upsert({
    where: { id: 4, name: 'COOPERADOR' },
    update: {},
    create: {
      name: 'COOPERADOR',
    },
  });

  const role_admin = await prisma.role.upsert({
    where: { id: 5, name: 'ADMIN' },
    update: {},
    create: {
      name: 'ADMIN',
    },
  });

  const role_pastor = await prisma.role.upsert({
    where: { id: 6, name: 'PASTOR' },
    update: {},
    create: {
      name: 'PASTOR',
    },
  });

  const role_deacon = await prisma.role.upsert({
    where: { id: 7, name: 'DIACONO' },
    update: {},
    create: {
      name: 'DIACONO',
    },
  });

  const role_levite = await prisma.role.upsert({
    where: { id: 8, name: 'LEVITA' },
    update: {},
    create: {
      name: 'LEVITA',
    },
  });

  console.log(role_visitor);
  console.log(role_sheep);
  console.log(role_leader);
  console.log(role_cooperator);
  console.log(role_admin);
  console.log(role_pastor);
  console.log(role_deacon);
  console.log(role_levite);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
