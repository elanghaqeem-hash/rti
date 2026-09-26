import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // prisma generate does not need a live database connection, but Prisma's
    // config still expects a datasource URL. Use the deployment secret when
    // available and a local SQLite fallback for build-time generation.
    url: process.env["DATABASE_URL"] ?? "file:./prisma/dev.db",
  },
});
