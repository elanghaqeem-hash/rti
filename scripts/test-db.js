const { PrismaClient } = require('@prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
const adapter = new PrismaBetterSqlite3({ url: 'file:dev.db' });
const prisma = new PrismaClient({ adapter });

async function run() {
  const users = await prisma.user.count();
  const leads = await prisma.lead.count();
  const proposals = await prisma.proposal.count();
  const orders = await prisma.order.count();
  const progress = await prisma.projectProgress.count();
  const tickets = await prisma.supportTicket.count();
  const blogs = await prisma.blog.count();
  const academy = await prisma.academyRegistration.count();
  const bookings = await prisma.booking.count();
  console.log('DB_STATUS:OK', JSON.stringify({ users, leads, proposals, orders, progress, tickets, blogs, academy, bookings }, null, 2));
  const userList = await prisma.user.findMany({ select: { id: true, email: true, role: true, name: true } });
  console.log('EXISTING_USERS:', JSON.stringify(userList, null, 2));
  await prisma.$disconnect();
}
run().catch(console.error);
