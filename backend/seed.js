const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("123456", 10);

  await prisma.user.createMany({
    data: [
      { name: "Manager", email: "manager@test.com", password, role: "Manager" },
      { name: "Dispatcher", email: "dispatcher@test.com", password, role: "Dispatcher" },
      { name: "Safety", email: "safety@test.com", password, role: "Safety" },
      { name: "Finance", email: "finance@test.com", password, role: "Finance" }
    ]
  });

  console.log("Users seeded!");
}

main();