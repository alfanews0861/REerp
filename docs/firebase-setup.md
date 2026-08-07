# Firebase Configuration & Security Guide

## Services Configured
1. **Authentication**: Identity management with custom claims for user roles (`super_admin`, `admin`, `marketing_manager`, `sales_agent`, `client`).
2. **Firestore Database**: NoSQL database with tenant-isolated security rules in `firestore.rules`.
3. **Cloud Functions v2**: Node.js 20 TypeScript backend handlers for background triggers and scheduled cron jobs.
4. **Cloud Storage**: Object storage for media assets with MIME type and size checks in `storage.rules`.
5. **Hosting**: Multi-site deployment setup for `admin-web` and `public-website`.
6. **Cloud Messaging (FCM)**: Push notification integration for web and mobile.

## Running Firebase Emulators
```bash
firebase emulators:start
```
- **Firestore UI**: http://localhost:4000
- **Auth Emulator**: localhost:9099
- **Firestore**: localhost:8080
- **Functions**: localhost:5001
- **Storage**: localhost:9199
