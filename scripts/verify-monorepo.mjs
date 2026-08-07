import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🔍 Verifying Enterprise Real Estate ERP Monorepo Bootstrap...');

const requiredDirs = [
  'apps/admin-web',
  'apps/marketing-mobile',
  'apps/public-website',
  'packages/ui',
  'packages/firebase',
  'packages/hooks',
  'packages/utils',
  'packages/types',
  'packages/config',
  'functions',
  'docs',
  'scripts',
];

let missing = 0;
for (const dir of requiredDirs) {
  const fullPath = path.join(rootDir, dir);
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ Missing directory: ${dir}`);
    missing++;
  } else {
    console.log(`✅ Directory verified: ${dir}`);
  }
}

if (missing > 0) {
  console.error(`🚨 Verification failed: ${missing} directories missing.`);
  process.exit(1);
} else {
  console.log('🎉 Monorepo structure verified successfully!');
}
