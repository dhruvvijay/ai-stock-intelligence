import { PrismaClient } from '@/generated/prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import fs from 'fs';
import path from 'path';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getDbPath(): string {
  // Local development — use project root
  if (process.env.NODE_ENV !== 'production') {
    return 'file:./dev.db';
  }

  // Vercel serverless — filesystem is read-only except /tmp
  // Copy the bundled dev.db to /tmp on cold start
  const tmpDbPath = '/tmp/dev.db';

  if (!fs.existsSync(tmpDbPath)) {
    // Look for the DB bundled in the deployment
    const possibleSources = [
      path.join(process.cwd(), 'dev.db'),
      path.join(process.cwd(), 'prisma', 'dev.db'),
      path.resolve('./dev.db'),
      path.resolve('./.next/server/dev.db'),
    ];

    for (const src of possibleSources) {
      if (fs.existsSync(src)) {
        console.log(`[Prisma] Copying DB from ${src} to ${tmpDbPath}`);
        fs.copyFileSync(src, tmpDbPath);
        break;
      }
    }

    // If still not found, try to find it anywhere in common build directories
    if (!fs.existsSync(tmpDbPath)) {
      console.error('[Prisma] Could not find dev.db in any expected location');
      console.error('[Prisma] CWD:', process.cwd());
      try {
        const cwdFiles = fs.readdirSync(process.cwd());
        console.error('[Prisma] Files in CWD:', cwdFiles.filter(f => f.endsWith('.db') || f === 'prisma').join(', '));
      } catch { /* ignore */ }
    }
  }

  return `file:${tmpDbPath}`;
}

function createPrismaClient() {
  const dbUrl = getDbPath();
  console.log(`[Prisma] Using database: ${dbUrl}`);
  const adapter = new PrismaBetterSqlite3({ url: dbUrl });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
