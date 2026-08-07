# Production Firebase Deployment Script
Write-Host "Deploying Real Estate ERP to Firebase..." -ForegroundColor Yellow

# Build project assets first
.\scripts\build.ps1

if ($LASTEXITCODE -eq 0) {
    Write-Host "Deploying Hosting, Firestore Rules & Cloud Functions..." -ForegroundColor Cyan
    firebase deploy
} else {
    Write-Host "Aborting deployment due to build failure." -ForegroundColor Red
}
