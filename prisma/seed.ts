/**
 * Seed script following next-auth patterns
 * Creates admin user (only admin is seeded, students and agents sign up)
 */

import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

// Use DIRECT_URL for seeding if available, otherwise fall back to DATABASE_URL
const connectionUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;

if (!connectionUrl) {
  console.error("❌ Error: DATABASE_URL or DIRECT_URL must be set in .env");
  process.exit(1);
}

console.log(
  "🔗 Using connection:",
  connectionUrl.replace(/:[^:@]+@/, ":****@") + "\n"
);

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: connectionUrl,
    },
  },
});

async function main() {
  console.log("🌱 Starting seed...");

  // Test connection first
  try {
    await prisma.$connect();
    console.log("✅ Database connection successful\n");
  } catch (error) {
    console.error("❌ Database connection failed!");
    console.error("Please check:");
    console.error(
      "1. Your DIRECT_URL is correct (use Session mode from Supabase)"
    );
    console.error("2. Your database is not paused");
    console.error("3. Your IP is allowed in Supabase network settings");
    throw error;
  }

  // Create admin user (only admin is seeded)
  const adminPassword = await bcrypt.hash("admin123456", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      password: adminPassword,
      name: "Admin User",
      role: Role.ADMIN,
      isVerified: true, // Admin is always verified
      emailVerified: new Date(),
    },
  });
  console.log("✅ Created admin user:", admin.email);

  console.log("\n✨ Seeding complete!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("ADMIN    | admin@example.com    | admin123456");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("\n📝 Note: Students and Agents sign up through the app");
  console.log("   - Students are auto-verified");
  console.log("   - Agents need admin verification\n");
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
