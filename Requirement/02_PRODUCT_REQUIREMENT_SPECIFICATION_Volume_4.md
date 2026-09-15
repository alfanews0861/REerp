# REOS Product Requirement Specification

# Volume 4

## Sales Network Engine, Agent Hierarchy & Commission Engine

Version: 1.0

------------------------------------------------------------------------

# 1. Purpose

The Sales Network Engine enables both professional sales teams and
multi-level agent networks to work on the same platform.

The architecture must support different commission structures without
changing source code.

------------------------------------------------------------------------

# 2. Workforce Types

Supported workforce:

-   Salaried Employee
-   Network Agent
-   Team Leader
-   Telecaller
-   Driver
-   Accountant
-   Office Staff
-   External Consultant

------------------------------------------------------------------------

# 3. System Role vs Business Position

System Role controls permissions.

Examples: - Admin - Marketing Executive - Driver - Accountant

Business Position controls hierarchy and commission.

Examples: - Sr CGM - CGM - GM - AGM - PM - SM - Marketing Executive

Business Positions are configurable.

------------------------------------------------------------------------

# 4. Network Hierarchy

Each member supports:

-   Sponsor
-   Upline
-   Downline
-   Team
-   Business Position
-   Active Status
-   Joining Date

Unlimited hierarchy depth must be supported.

------------------------------------------------------------------------

# 5. Lead Ownership

Every lead stores:

-   Lead Owner
-   Current Handler
-   Supporting Executive
-   Telecaller
-   Upline Chain

Changing Current Handler must not change Lead Owner.

------------------------------------------------------------------------

# 6. Commission Engine

Commission Plans are configurable.

Scope:

-   Company
-   Project
-   Phase
-   Team
-   Position
-   Effective Date

Commission Types:

-   Percentage
-   Fixed Amount
-   Mixed

Release Condition:

-   Full Payment Completed

------------------------------------------------------------------------

# 7. Commission Distribution

Support:

-   Lead Owner
-   Upline Levels
-   Team Leader
-   Telecaller (optional)
-   Company Override

Distribution rules must be configurable.

------------------------------------------------------------------------

# 8. Team Performance

Track:

-   Leads
-   Opportunities
-   Site Visits
-   Bookings
-   Registrations
-   Revenue
-   Conversion %
-   Commission Earned

------------------------------------------------------------------------

# 9. AI Insights

Identify:

-   Top Performing Teams
-   Weak Performing Teams
-   Idle Agents
-   High Conversion Agents
-   Commission Trends
-   Team Growth

Recommend:

-   Coaching
-   Reassignment
-   Follow-up Priority

------------------------------------------------------------------------

# 10. Dashboards

Agent Dashboard

-   My Leads
-   My Bookings
-   My Commission
-   Team Performance
-   Pending Follow-ups

Manager Dashboard

-   Network Growth
-   Team Revenue
-   Commission Payable
-   Top Agents
-   Underperforming Agents

------------------------------------------------------------------------

# 11. Acceptance Criteria

✓ Unlimited hierarchy

✓ Configurable positions

✓ Lead ownership preserved

✓ Configurable commission plans

✓ Multiple commission models

✓ Team analytics

✓ AI recommendations

End of Volume 4
