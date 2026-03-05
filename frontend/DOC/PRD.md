📄 PRODUCT REQUIREMENT DOCUMENT (PRD)
Product Name

Employee Management & Productivity SaaS (Frontend Simulation Engine)

Version

1.0 (Frontend-Only Intelligent Demo System)

Owner

Kiaan

1. PRODUCT OVERVIEW
1.1 Purpose

This system simulates a fully functional Employee Monitoring & Business Intelligence SaaS platform using only frontend architecture.
There is no backend. All logic, dummy data, analytics, and system behavior are handled via a centralized state engine.

The goal is to create a production-level interactive demo that behaves like a real SaaS application.

1.2 Key Objective

Provide realistic employee management workflow

Simulate live productivity analytics

Simulate payroll, tasks, compliance, and tracking

Maintain mathematical consistency across all modules

Ensure scalable architecture (no hardcoded component data)

2. SYSTEM ARCHITECTURE (FRONTEND ONLY)
2.1 Architecture Type

Frontend Stateful Simulation Architecture

2.2 Core Layers

UI Layer (Pages & Components)

Global Store Layer (Zustand / Context API)

Analytics Engine

Seed Data Generator

Service Layer (Simulated APIs)

No static arrays inside components.
All data must originate from centralized store.

3. USER FLOW (MANDATORY IMPLEMENTATION ORDER)

This is the correct SaaS onboarding sequence.

STEP 1 – Login

User logs in as Admin.

System initializes:

Global store

Seeded data

Organization config

Redirect → Productivity Dashboard

STEP 2 – Organization Setup

Settings → Organization

Configure:

Company Name

Timezone

Work Hours (e.g., 9 AM – 6 PM)

Workdays

This affects:

Schedule adherence

Payroll

Attendance

STEP 3 – Create Teams

Teams Module

Create:

Engineering

Sales

HR

Operations

Each team stores:

Member count

Total active hours

Productivity %

STEP 4 – Add Employees

Employees Module → Add Employee

Fields:

Name

Email

Role

Team

Work Location

Hourly Rate

On creation:
Auto-generate:

30 days attendance logs

30 days activity logs

Random productivity pattern

Random tasks

Location logs

STEP 5 – Create Projects

Projects Module → Add Project

Fields:

Project Name

Billable Rate

Assigned Team

Assigned Employees

On creation:
Generate:

Dummy logged hours

Linked tasks

Revenue projections

STEP 6 – Task Management

Tasks Module (Kanban)

Statuses:

Backlog

In Operations

Quality Assurance

Completed

Changing task status must:

Affect productivity %

Affect workload distribution

Affect payroll billables

STEP 7 – Location Tracking

Simulated:

Random GPS coordinates

Moving / Idle state

Check-in logs

Auto refresh every 20 seconds (state update simulation)

STEP 8 – Payroll

Payroll calculated from:
Total Active Hours × Hourly Rate

Shows:

Total payroll

Avg hourly

Outstanding invoices

Profit estimate

Must update dynamically.

STEP 9 – Compliance

Modules:

Role Permissions

Data Encryption

GDPR

Consent Management

Multi-Factor Authentication

Each toggle modifies global state.

Badges must update:
ACTIVE / DISABLED / ENCRYPTED / COMPLIANT

4. MODULE REQUIREMENTS
4.1 Dashboard (Productivity Trends)

Displays:

Total Work Time

Active Time

Idle Time

Productivity %

Utilization %

Team Breakdown

App Usage Breakdown

All computed from Activity Logs.

Date filter must re-calculate metrics.

4.2 Real-Time Insights

Displays:

Online Employees

Currently Active

Idle Count

Live Activity Table

Auto refresh simulation every 30 seconds.

4.3 Employees Module

Features:

Add

Edit

Delete

Merge (simulated data transfer)

Assign team

Assign project

Assign hourly rate

4.4 Teams Module

Create Team

View Team Metrics

Team Productivity %

Team Utilization %

4.5 Projects Module

Create Project

Assign Employees

Track Logged Hours

Billable Revenue

Project Milestones

4.6 Tasks (Kanban Board)

Create Task Modal

Drag between statuses

Assign employee

Set priority

Due date

Drag action must update metrics.

4.7 Location Tracking

Map with employee avatars

Moving / Idle label

Geo logs

Check-in history

Coordinates randomly update in store.

4.8 Payroll

Cards:

Total Payroll

Avg Hourly Rate

Outstanding Invoices

Net Profit Estimate

Graph:
Payroll Cost vs Hours

All values derived from logs.

4.9 Compliance
Role Permissions

Admin / Manager / Employee rule sets

Encryption

Boolean toggle

GDPR

Retention period state

Consent

% based on employee confirmation flag

2FA

Boolean state

All settings stored globally.

4.10 Settings (ALL MUST BE CLICKABLE)

Each card opens modal:

Alerts → Alert configuration

API Tokens → Token list simulation

Audit Logs → Activity list

Billing → Subscription modal

Email Reports → Toggle preferences

Integrations → Integration list

Manual Time → Config modal

Organization → Company settings

Privacy → GDPR modal

Security & Identity → MFA + Role permissions

Tracking Settings → Screenshot frequency

User Management → Role assign modal

Utilization → Calculation config

Each modal modifies global state.

5. DUMMY DATA ENGINE

Must generate:

20 employees

4 teams

6 projects

30 days logs

200+ activity records per employee

Random productive/unproductive pattern

Random GPS logs

Random payroll calculations

No static JSON in components.

6. ANALYTICS ENGINE FORMULAS

Productivity % =
(Productive Time / Total Active Time) × 100

Utilization % =
(Active Time / Work Hours) × 100

Payroll Total =
Sum (Employee Active Hours × Hourly Rate)

Team Productivity =
Average of team members

Schedule Adherence =
(On-time login days / Total workdays) × 100

Workload Distribution =
Total Tasks Assigned / Employee

7. NON-FUNCTIONAL REQUIREMENTS

No console errors

No hardcoded component data

Fully reactive state

Clean folder structure

Modular store design

Scalable architecture

8. FOLDER STRUCTURE

src/
store/
services/
data/
pages/
components/
modals/
analytics/

9. SUCCESS CRITERIA

✔ Dashboard updates with date filter
✔ Dragging task changes metrics
✔ Adding employee updates payroll
✔ Changing compliance toggles updates badges
✔ Location auto refresh works
✔ No UI break
✔ All Settings clickable

10. FUTURE SCALABILITY

Backend ready:

Replace fake services with real API

Replace seed generator with DB

Keep analytics engine reusable

END OF PRD