# REOS Product Requirement Specification

# Volume 7

## Booking Engine, Payment Engine, Registration & Customer Lifecycle

Version: 1.0

------------------------------------------------------------------------

# 1. Objective

Convert qualified opportunities into registered customers while
maintaining complete financial and audit history.

------------------------------------------------------------------------

# 2. Booking Lifecycle

Opportunity → Booking Created → Advance Received → Payment Collection →
Full Payment → Registration → Customer Activated

------------------------------------------------------------------------

# 3. Booking Types

-   Customer Booking
-   Investor Booking
-   Agent Booking
-   Bulk Booking

Bulk booking supports: - Multiple Plots - Entire Block - Entire Phase -
Entire Layout

------------------------------------------------------------------------

# 4. Mandatory Booking Data

-   Booking Number
-   Booking Date
-   Customer
-   Project
-   Phase
-   Layout
-   Block
-   Plot(s)
-   Booking Amount
-   Payment Mode
-   Lead Owner
-   Sales Team

------------------------------------------------------------------------

# 5. Payment Engine

Supported Methods

-   Cash
-   UPI
-   IMPS / NEFT / RTGS
-   Cheque
-   Demand Draft
-   Bank Loan
-   NBFC Loan
-   Mixed Payment

Features

-   Multiple installments
-   Multiple receipts
-   Payment adjustments
-   Refund entries (management approval)
-   Audit trail

------------------------------------------------------------------------

# 6. Payment Schedule

Support

-   One Time
-   Milestone Based
-   Monthly Installments
-   Custom Plan

Each schedule records:

-   Due Date
-   Amount
-   Paid Amount
-   Balance
-   Status

------------------------------------------------------------------------

# 7. Receipt Engine

Generate unique receipt numbers.

Receipt stores:

-   Payment Reference
-   Customer
-   Booking
-   Amount
-   Payment Method
-   Received By
-   Date & Time

Printable and shareable.

------------------------------------------------------------------------

# 8. Registration

Prerequisites

-   Booking Exists
-   Full Payment Completed
-   Management Approval
-   Required Documents Uploaded

Registration stores

-   Registration Number
-   Registration Date
-   Registrar Office
-   Document Reference
-   Remarks

------------------------------------------------------------------------

# 9. Customer Lifecycle

Lead → Opportunity → Booking → Registered Customer

After registration:

-   Customer Portal Enabled
-   Documents Visible
-   Payment History Available
-   Notifications Enabled

------------------------------------------------------------------------

# 10. Customer Portal

Customer can view

-   Booking Details
-   Plot Details
-   Receipts
-   Payment History
-   Documents
-   Announcements
-   Support Requests

------------------------------------------------------------------------

# 11. Finance Dashboard

Management views

-   Daily Collections
-   Outstanding Amount
-   Receivables
-   Commission Payable
-   Registration Pending
-   Cash Flow
-   Project Collections

------------------------------------------------------------------------

# 12. AI Features

Identify

-   Overdue Payments
-   High Risk Bookings
-   Registration Delays
-   Collection Trends

Predict

-   Collection Forecast
-   Registration Completion
-   Cash Flow

Recommend

-   Collection Priority
-   Customer Follow-up
-   Registration Schedule

------------------------------------------------------------------------

# 13. Acceptance Criteria

✓ Multiple booking types

✓ Flexible payment plans

✓ Multiple payment methods

✓ Receipt generation

✓ Registration workflow

✓ Customer portal activation

✓ Finance analytics

✓ AI collection insights

End of Volume 7
