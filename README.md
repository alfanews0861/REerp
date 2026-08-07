# Real Estate Marketing ERP

Production-grade Enterprise Real Estate Marketing ERP Monorepo built with React 19, TypeScript, Material UI (Material Design 3), Vite, Expo React Native, and Firebase Cloud Platform (Authentication, Firestore, Cloud Functions v2, Storage, Hosting, Cloud Messaging, Cloud Scheduler).

## Monorepo Architecture

```
real-estate-erp/
├── apps/
│   ├── admin-web/          # Enterprise Web Portal (Vite + React 19 + MUI MD3 + RTK + TanStack Query)
│   ├── marketing-mobile/   # Mobile Application (Expo React Native + TypeScript)
│   └── public-website/     # Public Marketing Web App (Vite + React 19 + MUI MD3)
├── packages/
│   ├── config/             # Workspace environment validation, constants, Vite base configs
│   ├── firebase/           # Typed Firebase SDK (Auth, Firestore, Functions v2, Storage, FCM)
│   ├── hooks/              # Shared React hooks (Auth context, Theme mode, UI helpers)
│   ├── ui/                 # MUI MD3 Theme Provider, light/dark palettes, baseline components
│   ├── utils/              # Shared formatters, Zod schema validation helpers, string utilities
│   └── types/              # Workspace TypeScript type declarations and contracts
├── functions/              # Firebase Cloud Functions v2 (Node.js 20 TypeScript triggers & APIs)
├── docs/                   # System architecture and deployment guide
└── scripts/                # CI verification and automation scripts
```

## Quick Start

### 1. Requirements
- Node.js `>= 20.0.0`
- pnpm `>= 9.0.0`
- Firebase CLI (`npm i -g firebase-tools`)

### 2. Installation
```bash
pnpm install
```

### 3. Development
```bash
# Start all workspace apps in dev mode
pnpm dev

# Or run specific target apps
pnpm --filter @real-estate-erp/admin-web dev
```

### 4. Build & Quality Verification
```bash
# Build all packages and apps
pnpm build

# Type check all TypeScript workspaces
pnpm type-check

# Lint all codebases
pnpm lint

# Format codebase
pnpm format
```

## Firebase Emulators
```bash
firebase emulators:start
```
Runs Auth on `:9099`, Firestore on `:8080`, Functions on `:5001`, Storage on `:9199`, and Emulator UI on `:4000`.
