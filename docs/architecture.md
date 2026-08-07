# Architecture Specification - Real Estate Marketing ERP

## 1. System Overview
Enterprise multi-channel Real Estate ERP monorepo designed for high scalability, security, and component reusability across Web and Mobile platforms.

## 2. Monorepo Package Topology
```
                  ┌──────────────────────┐
                  │   @real-estate-erp   │
                  │        types         │
                  └──────────┬───────────┘
                             │
       ┌─────────────────────┼─────────────────────┐
       ▼                     ▼                     ▼
┌──────────────┐     ┌──────────────┐      ┌──────────────┐
│    config    │     │    utils     │      │   firebase   │
└──────┬───────┘     └──────┬───────┘      └──────┬───────┘
       │                    │                     │
       └──────────┬─────────┴──────────┬──────────┘
                  ▼                    ▼
           ┌─────────────┐      ┌─────────────┐
           │     ui      │      │    hooks    │
           └──────┬──────┘      └──────┬──────┘
                  │                    │
                  └──────────┬─────────┘
                             ▼
         ┌───────────────────┼───────────────────┐
         ▼                   ▼                   ▼
┌──────────────────┐┌──────────────────┐┌──────────────────┐
│    admin-web     ││  public-website  ││ marketing-mobile │
└──────────────────┘└──────────────────┘└──────────────────┘
```

## 3. Technology Stack & Framework Choices
- **React 19 & TypeScript 5.5+**: Type-safe component architecture.
- **Material UI v6**: MD3 Theme Provider with Dark/Light palette switching, responsive breakpoints (`xs`, `sm`, `md`, `lg`, `xl`), typography and spacing scale.
- **Vite**: Ultra-fast frontend bundler with custom HMR and workspace path aliases.
- **TanStack Query v5**: Server state management, caching, background polling, and optimistic updates.
- **Redux Toolkit**: Client layout and user authentication state management.
- **Firebase v10**: Web SDK v10 (Auth, Firestore, Cloud Functions v2, Storage, Hosting, FCM Messaging).
