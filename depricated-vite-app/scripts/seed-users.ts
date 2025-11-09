/**
 * Seed script to create test users with different roles
 * Run this script to populate your database with test users
 *
 * Usage:
 *   npx tsx scripts/seed-users.ts
 *
 * Or with bun:
 *   bun run scripts/seed-users.ts
 */

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, "../.env.local") });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error(
    "Error: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables"
  );
  console.error(
    "Please set these in your .env.local file or environment variables"
  );
  process.exit(1);
}

// Create admin client with service role key for bypassing RLS
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

interface TestUser {
  email: string;
  password: string;
  role: "admin" | "agent" | "student";
  name: string;
}

const testUsers: TestUser[] = [
  {
    email: "admin@example.com",
    password: "admin123456",
    role: "admin",
    name: "Admin User",
  },
  {
    email: "agent@example.com",
    password: "agent123456",
    role: "agent",
    name: "Agent User",
  },
  {
    email: "student@example.com",
    password: "student123456",
    role: "student",
    name: "Student User",
  },
];

async function seedUsers() {
  console.log("🌱 Starting user seeding...\n");

  for (const user of testUsers) {
    try {
      console.log(`Creating user: ${user.email} (${user.role})...`);

      // Check if user already exists
      const { data: existingUsers } = await supabase.auth.admin.listUsers();
      const existingUser = existingUsers?.users.find(
        (u) => u.email === user.email
      );

      let userId: string;

      if (existingUser) {
        console.log(
          `  ⚠️  User ${user.email} already exists, skipping creation...`
        );
        userId = existingUser.id;
      } else {
        // Create the user
        const { data: newUser, error: createError } =
          await supabase.auth.admin.createUser({
            email: user.email,
            password: user.password,
            email_confirm: true, // Auto-confirm email for testing
          });

        if (createError) {
          console.error(`  ❌ Error creating user: ${createError.message}`);
          continue;
        }

        userId = newUser.user.id;
        console.log(`  ✅ User created with ID: ${userId}`);
      }

      // Check if role already exists
      const { data: existingRole } = await supabase
        .from("user_roles")
        .select("id")
        .eq("user_id", userId)
        .eq("role", user.role)
        .maybeSingle();

      if (existingRole) {
        console.log(
          `  ⚠️  Role ${user.role} already assigned to ${user.email}`
        );
      } else {
        // Assign role
        const { error: roleError } = await supabase.from("user_roles").insert({
          user_id: userId,
          role: user.role,
        });

        if (roleError) {
          console.error(`  ❌ Error assigning role: ${roleError.message}`);
        } else {
          console.log(`  ✅ Role ${user.role} assigned successfully`);
        }
      }

      console.log(`  📧 Email: ${user.email}`);
      console.log(`  🔑 Password: ${user.password}\n`);
    } catch (error) {
      console.error(`  ❌ Unexpected error for ${user.email}:`, error);
      console.log();
    }
  }

  console.log("✨ Seeding complete!\n");
  console.log("Test users created:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  testUsers.forEach((user) => {
    console.log(
      `${user.role.toUpperCase().padEnd(8)} | ${user.email} | ${user.password}`
    );
  });
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
}

seedUsers()
  .then(() => {
    console.log("✅ Seed script completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Seed script failed:", error);
    process.exit(1);
  });
