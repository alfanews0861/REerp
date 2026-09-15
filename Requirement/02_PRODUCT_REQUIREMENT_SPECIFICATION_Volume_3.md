# REOS Product Requirement Specification

# Volume 3

## CRM, Lead Engine & Opportunity Engine

Version: 1.0

------------------------------------------------------------------------

# 1. CRM Philosophy

The CRM is person-centric.

Entity lifecycle:

Person → Lead → Opportunity → Customer

Every stage preserves history. No business record is permanently
deleted.

------------------------------------------------------------------------

# 2. Person Module

Purpose: Maintain a single master profile for every individual.

Core Features

-   Multiple mobile numbers
-   Multiple email addresses
-   Addresses
-   Identity documents
-   Tags
-   Family members
-   Occupation
-   Communication preferences
-   Duplicate detection
-   Merge persons
-   Complete audit trail

------------------------------------------------------------------------

# 3. Lead Module

Lead Sources

-   Walk-in
-   Website
-   Facebook
-   Instagram
-   Google Ads
-   Telecaller
-   Agent
-   Reference
-   Existing Customer
-   Door-to-door
-   Exhibition
-   Import/API

Mandatory Fields

-   Lead Number
-   Person
-   Lead Owner
-   Source
-   Project
-   Mobile
-   Created Date

Optional

-   Budget
-   Preferred Location
-   Preferred Facing
-   Preferred Plot Size
-   Investment Purpose

------------------------------------------------------------------------

# 4. Lead Ownership

Rules

-   Lead belongs to the Lead Owner.
-   Ownership change requires authorization.
-   Supporting executives may assist.
-   Timeline records every action.

------------------------------------------------------------------------

# 5. Lead Timeline

Automatically record:

-   Lead Created
-   Call Made
-   WhatsApp Sent
-   SMS Sent
-   Meeting
-   Follow-up
-   Site Visit
-   Note Added
-   Status Changed
-   Opportunity Created

Timeline is immutable.

------------------------------------------------------------------------

# 6. Follow-up Engine

Follow-up Types

-   Phone
-   WhatsApp
-   Office Meeting
-   Site Visit
-   Reminder
-   Document Request

Status

-   Pending
-   Completed
-   Missed
-   Rescheduled

AI should highlight overdue follow-ups.

------------------------------------------------------------------------

# 7. Opportunity Engine

Opportunity is created after qualification.

Mandatory

-   Project
-   Estimated Budget
-   Buying Purpose
-   Purchase Timeline
-   Assigned Business Team

Stages

-   New
-   Contacted
-   Qualified
-   Visit Planned
-   Visit Completed
-   Negotiation
-   Booking
-   Lost

Lost Reasons

-   Price
-   Location
-   Family Decision
-   Competitor
-   Loan
-   No Response
-   Other

------------------------------------------------------------------------

# 8. Search

Global search by:

-   Mobile
-   Name
-   Plot Number
-   Booking Number
-   Customer Number

------------------------------------------------------------------------

# 9. Dashboards

Marketing Executive

-   My Leads
-   Today's Follow-ups
-   Today's Visits
-   My Opportunities
-   My Bookings
-   Conversion %

Manager

-   Team Leads
-   Team Visits
-   Team Conversion
-   Lost Opportunities
-   Executive Ranking

------------------------------------------------------------------------

# 10. AI Features

Suggest:

-   Best follow-up time
-   Hot leads
-   Cold leads
-   Duplicate leads
-   Lead priority
-   Next action
-   Probability of booking

------------------------------------------------------------------------

# Acceptance Criteria

✓ Duplicate prevention

✓ Complete timeline

✓ Ownership tracking

✓ Opportunity conversion

✓ AI prioritization

✓ Global search

✓ Audit logs

End of Volume 3
