# REOS Database Blueprint

# Volume 1

## Firestore Architecture & Collection Strategy

Version: 1.0

------------------------------------------------------------------------

# 1. Database Philosophy

REOS uses Cloud Firestore as the primary transactional database.

Principles

-   Multi-tenant
-   Event-driven
-   Soft Delete
-   Immutable Audit
-   Offline-first
-   Scalable

------------------------------------------------------------------------

# 2. Root Collections

companies branches users roles permissions departments teams

projects phases layouts blocks plots

persons leads opportunities interactions followups

bookings payments receipts customers

campaigns campaignExpenses

vehicles drivers trips expenses

workflowDefinitions workflowInstances workflowHistory

notifications documents media settings

auditLogs events aiSuggestions

------------------------------------------------------------------------

# 3. Subcollections

users/{userId}/sessions

persons/{personId}/relationships

projects/{projectId}/documents

bookings/{bookingId}/payments

customers/{customerId}/tickets

------------------------------------------------------------------------

# 4. Common Fields

Every document contains:

-   id
-   companyId
-   branchId
-   createdAt
-   updatedAt
-   createdBy
-   updatedBy
-   isActive
-   isDeleted
-   version

------------------------------------------------------------------------

# 5. Naming Standards

Collections: lowerCamelCase plural

Document IDs: Firestore Auto IDs unless business key is required.

Business Keys: Project Code Plot Number Booking Number Receipt Number

------------------------------------------------------------------------

# 6. Data Lifecycle

Create ↓

Update ↓

Archive (Soft Delete) ↓

Audit Retained

No permanent delete for business entities.

------------------------------------------------------------------------

# 7. Security Boundary

Tenant → Company → Branch

Every query must be scoped by companyId.

------------------------------------------------------------------------

# 8. Index Strategy

Composite indexes for:

-   companyId + status
-   companyId + createdAt
-   projectId + plotNumber
-   leadOwner + status
-   bookingStatus + projectId

------------------------------------------------------------------------

# 9. Acceptance Criteria

✓ Multi-company ready

✓ Immutable audit

✓ Offline sync friendly

✓ Firestore scalable

End of Database Blueprint Volume 1
