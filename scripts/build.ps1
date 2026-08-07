# Monorepo Build Execution Script
Write-Host "Building all workspace packages and applications..." -ForegroundColor Cyan

pnpm run type-check
if ($LASTEXITCODE -ne 0) {
    Write-Host "TypeScript verification failed." -ForegroundColor Red
    exit 1
}

pnpm run build
if ($LASTEXITCODE -eq 0) {
    Write-Host "Monorepo build completed successfully!" -ForegroundColor Green
} else {
    Write-Host "Build failed." -ForegroundColor Red
    exit 1
}
