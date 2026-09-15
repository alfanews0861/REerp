# REOS Product Requirement Specification

# Volume 5

## Project, Inventory & Pricing Engine

Version: 1.0

------------------------------------------------------------------------

# 1. Purpose

The Inventory Engine is the core business engine of REOS.

Everything revolves around inventory.

The system must manage:

-   Projects
-   Phases
-   Layouts
-   Blocks
-   Plots
-   Bulk Inventory

------------------------------------------------------------------------

# 2. Project Lifecycle

States:

1.  Land Identification
2.  Land Acquisition
3.  Legal Verification
4.  Layout Design
5.  Government Approval
6.  Sales Approval
7.  Pre Launch
8.  Launch
9.  Development
10. Registration Ready
11. Completed

Sales may begin immediately after Sales Approval.

------------------------------------------------------------------------

# 3. Inventory Hierarchy

Company → Project → Phase → Layout → Block → Plot

------------------------------------------------------------------------

# 4. Plot Master

Mandatory Fields

-   Project
-   Phase
-   Layout
-   Block
-   Plot Number
-   Survey Number
-   Area
-   Facing
-   Road Width
-   Plot Dimensions
-   GPS Coordinates
-   Status

Optional

-   Corner Plot
-   Park Facing
-   Commercial
-   Premium
-   Remarks

------------------------------------------------------------------------

# 5. Plot Status

Only supported business statuses:

-   Available
-   Booked
-   Registered

Customer-facing screens must never display: - Cancelled - Litigation -
Hold - Owner Retained - Not for Sale

Internal flags may exist but are hidden from customers.

------------------------------------------------------------------------

# 6. Inventory Types

Support booking of:

-   Single Plot
-   Multiple Plots
-   Entire Block
-   Entire Phase
-   Entire Layout

------------------------------------------------------------------------

# 7. Pricing Engine

Every inventory item supports:

-   Public Price
-   Internal Price
-   Agent Price
-   Investor Price
-   Festival Price
-   Special Price
-   Cut-off Price

Every price change must be recorded with:

-   Old Price
-   New Price
-   Effective Date
-   Approved By
-   Reason

Price history is immutable.

------------------------------------------------------------------------

# 8. Inventory Ledger

Every Plot maintains a complete ledger.

Examples:

-   Created
-   Price Updated
-   Booked
-   Payment Received
-   Registration Completed

Ledger entries cannot be edited or deleted.

------------------------------------------------------------------------

# 9. Bulk Operations

Management can:

-   Import Plots
-   Bulk Price Update
-   Bulk Status Update
-   Bulk Export
-   Bulk Assignment

------------------------------------------------------------------------

# 10. Dashboards

Project Dashboard

-   Available Inventory
-   Booked Inventory
-   Registered Inventory
-   Sales by Phase
-   Sales by Block
-   Inventory Value
-   Average Selling Price

Pricing Dashboard

-   Latest Price Changes
-   Highest Selling Blocks
-   Slow Moving Inventory
-   Price Trend

------------------------------------------------------------------------

# 11. AI Features

Recommend:

-   Price increase opportunities
-   Slow inventory alerts
-   Fast moving phases
-   High demand facing
-   Inventory aging
-   Unsold inventory strategy

Predict:

-   Inventory depletion date
-   Expected project revenue

------------------------------------------------------------------------

# 12. Acceptance Criteria

✓ Unlimited Projects

✓ Unlimited Phases

✓ Unlimited Layouts

✓ Unlimited Blocks

✓ Unlimited Plots

✓ Bulk Operations

✓ Complete Price History

✓ Immutable Inventory Ledger

✓ AI Inventory Insights

End of Volume 5
