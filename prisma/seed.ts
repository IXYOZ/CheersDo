import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // ล้างตารางทั้งหมดตามลำดับความสัมพันธ์
  await prisma.verificationToken.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.todo.deleteMany();  // ถ้าคุณมี model Todo
  await prisma.user.deleteMany();

  console.log("Database cleared.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
