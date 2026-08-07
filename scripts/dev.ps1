# Development Startup Script for Enterprise Real Estate ERP Monorepo
Write-Host "Starting Enterprise Real Estate ERP Development Environment..." -ForegroundColor Green

# Verify pnpm is installed
if (-not (Get-Command pnpm -ErrorAction SilentlyContinue)) {
    Write-Host "Error: pnpm package manager is required. Please install pnpm." -ForegroundColor Red
    exit 1
}

# Run Turborepo Dev Pipeline
pnpm run dev
