const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const deployDir = path.join(rootDir, '.deploy');

console.log('Building for deployment...');

// Ensure .deploy directory exists
if (fs.existsSync(deployDir)) {
  fs.rmSync(deployDir, { recursive: true, force: true });
}
fs.mkdirSync(deployDir, { recursive: true });
fs.mkdirSync(path.join(deployDir, 'lib'), { recursive: true });

// Run esbuild
const esbuildCmd = `npx esbuild src/index.ts --bundle --platform=node --target=node24 --outfile=.deploy/lib/index.js --external:firebase-admin --external:firebase-functions`;
console.log('Running:', esbuildCmd);
execSync(esbuildCmd, { cwd: rootDir, stdio: 'inherit' });

// Create sanitized package.json
const pkgPath = path.join(rootDir, 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

const deployPkg = {
  name: "functions-deployable",
  version: pkg.version,
  private: true,
  main: "lib/index.js",
  engines: pkg.engines,
  dependencies: pkg.dependencies
  // No devDependencies! No workspace:*!
};

fs.writeFileSync(
  path.join(deployDir, 'package.json'),
  JSON.stringify(deployPkg, null, 2)
);

console.log('Successfully created sanitized deployment package at .deploy/package.json');
