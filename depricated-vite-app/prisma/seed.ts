/**
 * Seed script following next-auth patterns
 * Creates test users with different roles
 */

import { Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("🌱 Starting seed...");

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123456", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      password: adminPassword,
      name: "Admin User",
      role: Role.ADMIN,
      emailVerified: new Date(),
    },
  });
  console.log("✅ Created admin user:", admin.email);

  // Create agent user
  const agentPassword = await bcrypt.hash("agent123456", 10);
  const agent = await prisma.user.upsert({
    where: { email: "agent@example.com" },
    update: {},
    create: {
      email: "agent@example.com",
      password: agentPassword,
      name: "Agent User",
      role: Role.AGENT,
      emailVerified: new Date(),
    },
  });
  console.log("✅ Created agent user:", agent.email);

  // Create student user
  const studentPassword = await bcrypt.hash("student123456", 10);
  const student = await prisma.user.upsert({
    where: { email: "student@example.com" },
    update: {},
    create: {
      email: "student@example.com",
      password: studentPassword,
      name: "Student User",
      role: Role.STUDENT,
      emailVerified: new Date(),
    },
  });
  console.log("✅ Created student user:", student.email);

  console.log("\n✨ Seeding complete!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("ADMIN    | admin@example.com    | admin123456");
  console.log("AGENT    | agent@example.com    | agent123456");
  console.log("STUDENT  | student@example.com | student123456");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
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
