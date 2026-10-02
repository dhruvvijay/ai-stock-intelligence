import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Include the SQLite database in serverless function bundles
  outputFileTracingIncludes: {
    '/api/**': ['./dev.db'],
    '/stocks/**': ['./dev.db'],
  },
  // Ensure better-sqlite3 native module is bundled
  serverExternalPackages: ['better-sqlite3'],
};

export default nextConfig;
