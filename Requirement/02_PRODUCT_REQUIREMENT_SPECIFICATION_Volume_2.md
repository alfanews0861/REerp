# REOS Product Requirement Specification

# Volume 2

## Business Rules, Functional Requirements & Acceptance Criteria

Version: 1.0

------------------------------------------------------------------------

# 1. Business Rules

## BR-001 Lead Ownership

-   Every Lead has exactly one Lead Owner.
-   Lead Owner is eligible for commission.
-   Current Handler may change.
-   Senior Support may assist.
-   Lead history is immutable.

------------------------------------------------------------------------

## BR-002 Opportunity

A Lead becomes an Opportunity only after qualification.

Minimum data:

-   Project
-   Budget
-   Buying Purpose
-   Purchase Timeline

------------------------------------------------------------------------

## BR-003 Site Visit

Site Visit is mandatory before normal plot booking unless Management
overrides.

Supported travel:

-   Company Vehicle
-   Executive Vehicle
-   Customer Vehicle
-   Direct Visit
-   Office Pickup

Visit Outcome is mandatory.

Allowed outcomes:

-   Very Interested
-   Interested
-   Need Discussion
-   Need Discount
-   Need Loan
-   Follow-up
-   Booked
-   Not Interested

------------------------------------------------------------------------

## BR-004 Booking

Reservation is not supported.

Booking requires:

-   Customer
-   Inventory Item
-   Booking Advance
-   Booking Date

Supported booking types:

-   Customer
-   Investor
-   Agent
-   Bulk

------------------------------------------------------------------------

## BR-005 Registration

Registration requires:

-   Full Payment
-   Booking Confirmation
-   Required Documents Uploaded

------------------------------------------------------------------------

## BR-006 Commission

Commission Rules are configurable.

Configuration levels:

-   Company
-   Project
-   Team
-   Business Position
-   Effective Date

Commission is released only after Full Payment.

------------------------------------------------------------------------

## BR-007 Inventory

Inventory hierarchy:

Company → Project → Phase → Layout → Block → Plot

Primary Identity:

Project + Plot Number

Plot Status:

-   Available
-   Booked
-   Registered

------------------------------------------------------------------------

# 2. Functional Requirements

## Lead Module

System shall:

-   Create Lead
-   Merge Duplicate Lead
-   Track Follow-ups
-   Store Interaction Timeline
-   Assign Supporting Executives
-   Maintain Audit Trail

------------------------------------------------------------------------

## Opportunity Module

System shall:

-   Convert Lead
-   Track Negotiation
-   Schedule Visits
-   Store Buying Interest
-   Record Preferred Plots

------------------------------------------------------------------------

## Site Visit Module

System shall:

-   Schedule Visit
-   Capture GPS
-   Capture Photos
-   Capture Voice Notes
-   Track Vehicle
-   Record Visit Result

------------------------------------------------------------------------

## Inventory Module

System shall:

-   Maintain Plot Master
-   Support Dynamic Pricing
-   Track Price History
-   Support Bulk Booking
-   Support Investor Inventory

------------------------------------------------------------------------

## Finance Module

System shall:

-   Record Payments
-   Generate Receipts
-   Track Outstanding
-   Calculate Commission
-   Export Reports

------------------------------------------------------------------------

# 3. User Stories

### Marketing Executive

As a Marketing Executive, I want to own my leads, so that my commission
remains protected.

------------------------------------------------------------------------

### Telecaller

As a Telecaller, I want to transfer qualified leads, so that executives
can continue the sales process.

------------------------------------------------------------------------

### Manager

As a Manager, I want AI insights, so that I can improve sales
performance.

------------------------------------------------------------------------

### Customer

As a Customer, I want to see my booking, payments and documents, so that
I do not need to visit the office repeatedly.

------------------------------------------------------------------------

# 4. Acceptance Criteria

## Lead

✓ Duplicate detection

✓ Timeline

✓ Follow-up reminders

✓ Audit log

------------------------------------------------------------------------

## Opportunity

✓ Qualification

✓ Visit planning

✓ Negotiation history

------------------------------------------------------------------------

## Site Visit

✓ GPS

✓ Vehicle

✓ Outcome

✓ Photos

------------------------------------------------------------------------

## Booking

✓ Advance

✓ Inventory lock

✓ Receipt

------------------------------------------------------------------------

## Registration

✓ Full payment validation

✓ Documents available

------------------------------------------------------------------------

## Reports

Management must view:

-   Daily Sales
-   Lead Funnel
-   Conversion %
-   Inventory Status
-   Revenue
-   Commission
-   Vehicle Usage
-   Agent Performance
-   AI Recommendations

------------------------------------------------------------------------

End of Volume 2
