# Enterprise Real Estate Marketing ERP - Master Product Requirement Specification (PRD)

## 1. Executive Summary & Core Objectives

The **Enterprise Real Estate Marketing ERP** is an end-to-end, multi-channel platform engineered to replace fragmented Excel sheets, paper logs, WhatsApp threads, and manual reporting with a unified, real-time enterprise system.

### Key Applications
1. **Admin Portal (`apps/admin-web`)**: React 19 + Material UI (MUI Material 3 theme) + Redux Toolkit + TanStack Query platform for executive management, operations, finance, and system configuration.
2. **Public Website (`apps/public-website`)**: High-performance SEO-optimized property portal & lead generation engine built with React 19 + Vite.
3. **Marketing Mobile App (`apps/marketing-mobile`)**: React Native Expo app for field agents, marketing executives, drivers, and site managers supporting offline-first operations, GPS tracking, and lead capture.
4. **Backend Services (`functions/` & `packages/firebase`)**: Cloud Functions v2, Firestore triggers, Cloud Scheduler, and Firebase Storage.

---

## 2. Multi-Role RBAC Security Matrix

The ERP enforces strict Role-Based Access Control (RBAC) across 10 distinct user personas:

| Role | Admin Portal | Mobile App | Public Website | Scope & Permissions |
|---|---|---|---|---|
| **Super Admin** | Full Access | Full Access | Full Access | Complete system configuration, tenant management, data backups, system audits. |
| **Director** | Executive Dashboards | Read-Only | Read-Only | Financial reports, project oversight, approval of bookings & major expenses. |
| **Branch Manager** | Branch Scope | Branch Scope | N/A | Branch lead allocation, team performance, local inventory control, expense approvals. |
| **Marketing Manager** | Marketing & Campaigns | Campaign Tools | N/A | Campaign creation, lead source ROI, ad budgets, marketing executive management. |
| **Marketing Executive** | Assigned Leads | Agent Dashboard | N/A | Lead capture, site visit execution, customer follow-ups, GPS attendance. |
| **Sales Executive** | Sales Pipeline | Agent Dashboard | N/A | Plot blocking, booking creation, customer payment schedules, negotiation history. |
| **Telecaller** | Lead Call Queue | N/A | N/A | Lead verification, call log updates, appointment & site visit scheduling. |
| **Driver** | N/A | Driver Portal | N/A | Site visit transit, vehicle logbook, fuel receipts, mileage & GPS tracking. |
| **Accountant** | Financial ERP | N/A | N/A | Payment verification, receipt generation, vehicle/general expense audits, payroll. |
| **Customer** | Customer Portal (Limited) | N/A | Property Browsing | Saved listings, site visit requests, booking status, payment receipts & installment schedule. |

---

## 3. Core Functional Modules & Technical Architecture

### 3.1. Property & Plot Inventory Management
- **Projects**: Multi-phase real estate projects with master layout maps, amenities, approval docs, geolocation bounds.
- **Plot Inventory**: Granular status tracking (`AVAILABLE`, `HOLD`, `BOOKED`, `REGISTERED`, `BLOCKED`).
- **Dynamic Pricing Engine**: Base price/sq.ft, corner premium, facing premium (East/North), PLC charges, dynamic discount authorizations.

### 3.2. Lead & CRM Pipeline
- **Lead Capture Engine**: Automatic ingestion from Public Website, Meta Ads, Google Ads, housing portals, and manual walk-ins.
- **Follow-up Engine**: Automated follow-up reminders, WhatsApp API integration triggers, disposition logging (`INTERESTED`, `NOT_REACHABLE`, `SITE_VISIT_SCHEDULED`, `NEGOTIATING`, `LOST`).
- **Site Visit Operations**: Bus/cab allocation, driver assignment, customer pickup tracking, site visit completion verification.

### 3.3. Bookings, Agreements & Payments
- **Plot Booking Workflow**: Hold locking with time-bound expiration, advance token collection, verification workflow.
- **Payment Schedules**: Down-payment, EMI installment matrices, late penalty rules, automated receipt generation & PDF invoices.

### 3.4. Field Operations: GPS, Vehicle & Expense Tracking
- **Attendance & Geo-Fencing**: Mobile app punch-in/out with location verification and selfie photo proof.
- **Vehicle & Fuel Management**: Odometer start/end readings, fuel refill receipts upload, per-km reimbursement calculation.
- **General Expenses**: Categorized operational expense submission, approval workflow by Branch Manager/Director.

### 3.5. Campaign Management & Marketing Analytics
- **Campaign ROI Engine**: Multi-channel ad spend tracking, Cost-per-Lead (CPL), Cost-per-Acquisition (CPA).
- **Lead Source Scoring**: Conversion rate metrics across digital, print, referral, and offline events.

### 3.6. AI Assistant (Gemini 3.6 Flash Integration)
- **Smart Lead Scoring**: AI analysis of customer interactions and intent signal classification.
- **Automated Summaries**: Site visit summaries, follow-up script recommendations, executive performance insights.

---

## 4. Technical Quality Standards
- **Strict Typing**: 100% TypeScript strict mode compliance with Zod validation on every API boundary.
- **Clean Architecture**: Decoupled package architecture (`packages/types`, `packages/services`, `packages/ui`, `packages/hooks`).
- **No Mock/Placeholder Data**: Production data schemas, real Firestore converters, and authentic business logic.
