import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const email = "dr.dawn@medchain.com";

  const existingDoctor = await prisma.user.findUnique({
    where: { email },
  });

  if (existingDoctor) {
    console.log("Doctor already exists.");
    return;
  }

  const hashedPassword = await bcrypt.hash("drdawn", 10);

  await prisma.user.create({
    data: {
      name: "Dr. Dawn",
      email,
      password: hashedPassword,
      hospitalName: "MedChain General Hospital",
    },
  });

  console.log("Doctor seeded successfully.");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });