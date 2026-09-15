# REOS Database Blueprint

# Collection Specification 01

## companies

Version: 1.0

## Purpose

Represents a legal business entity operating inside REOS.

## Collection

`companies`

## Primary Key

-   id (Firestore Document ID)

## Business Keys

-   companyCode (Unique)
-   companyName

## Fields

  Field                Type          Required Notes
  -------------------- ----------- ---------- --------------------------------
  id                   string             Yes Firestore document id
  companyCode          string             Yes Unique business code
  companyName          string             Yes Display name
  legalName            string             Yes Registered legal name
  companyType          enum               Yes Developer / Marketing / Hybrid
  registrationNumber   string              No Government registration
  gstNumber            string              No GST
  panNumber            string              No PAN
  email                string              No Official email
  phone                string              No Official phone
  website              string              No Website
  address              object             Yes Registered address
  logoUrl              string              No Storage URL
  currency             string             Yes Default INR
  timezone             string             Yes Asia/Kolkata
  isActive             boolean            Yes Active status
  isDeleted            boolean            Yes Soft delete
  createdAt            timestamp          Yes Audit
  updatedAt            timestamp          Yes Audit
  createdBy            string             Yes User id
  updatedBy            string             Yes User id
  version              number             Yes Optimistic locking

## Relationships

-   Company → Branches (1:N)
-   Company → Users (1:N)
-   Company → Projects (1:N)
-   Company → Campaigns (1:N)
-   Company → Vehicles (1:N)

## Business Rules

1.  companyCode is immutable after creation.
2.  Soft delete only.
3.  A company cannot be deleted while active projects exist.
4.  Every business record must reference companyId.

## Firestore Indexes

-   companyCode
-   isActive + createdAt
-   companyName

## Security

-   Accessible only to authenticated users belonging to the same
    company.
-   Super Admin may access all companies.

## Cloud Functions

On Create: - Create default settings - Create default roles - Create
default departments - Create default notification templates

## Events

-   CompanyCreated
-   CompanyUpdated
-   CompanyActivated
-   CompanyDeactivated

## UI Usage

-   Company Setup
-   Administration
-   Reports
-   Settings

## APIs

-   Create Company
-   Update Company
-   Get Company
-   List Companies
-   Activate Company
-   Deactivate Company

## Acceptance Criteria

-   Unique company code enforced.
-   Multi-tenant isolation enforced.
-   Audit history retained.
-   Soft delete only.
