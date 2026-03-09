You are a Senior SaaS Frontend System Architect.

I have a fully designed React-based Employee Management UI with the following sidebar modules:

Productivity Trends

Real-time Insights

Alerts

Employees

Teams

Screenshot Monitoring

Time & Attendance

Activity Monitoring

Projects

Reports

Location Tracking

Tasks

Payroll

Compliance

Settings

There is NO backend.

Your job is to convert this entire frontend into a fully working, production-level intelligent simulation system using only frontend state architecture and dynamic dummy data.

This must follow the provided PRD architecture and onboarding flow.

🔥 CORE REQUIREMENTS
1. ARCHITECTURE

Create a centralized global state system using Zustand (or Context API if required).

Create the following folder structure:

src/
store/
services/
analytics/
data/
modals/
pages/

NO static arrays inside components.

All data must come from centralized store.

2. SEED ENGINE (MANDATORY)

Create a seed generator that runs on first load and generates:

20 0.

4 Teams (Engineering, Sales, HR, Operations)

6 Projects

120+ Tasks distributed across statuses

30 days Attendance logs per employee

30 days Activity logs per employee

Random app usage logs

Random productive / neutral / unproductive classification

GPS coordinates per employee

Random geo check-in logs

Hourly rate per employee

Random payroll data

Seed must generate mathematically consistent data.

3. GLOBAL DATA MODELS

Create centralized state objects:

employees[]
teams[]
projects[]
tasks[]
attendanceLogs[]
activityLogs[]
appUsageLogs[]
locationLogs[]
alerts[]
payrollData
complianceSettings
organizationSettings
permissions

4. USER FLOW ENGINE (STRICT ORDER)

System must follow this onboarding logic:

Login → Initialize store

Organization Setup

Create Teams

Add Employees

Create Projects

Assign Tasks

Auto-generate logs

Compute analytics

Enable compliance modules

All modules must be interconnected.

5. MODULE IMPLEMENTATION
Productivity Trends

Calculate dynamically:

Total Work Time

Active Time

Idle Time

Productivity %

Utilization %

Team Breakdown

App Usage Breakdown

Date filter must recalculate metrics.

Real-time Insights

Show currently active employees

Show idle count

Auto-refresh simulation every 30 seconds

Update activity state randomly

Alerts

Auto-generate alerts if:

Idle > threshold

Unproductive > threshold

Late login

Alerts list must update dynamically.

Employees

Buttons must work:

Add Employee

Edit

Delete

Merge

On Add:
Auto-create logs and tasks.

Teams

Create Team must:

Add team to state

Recalculate team metrics

Screenshot Monitoring

Simulate:

Screenshot every X minutes

Random productivity label

Timeline slider

Blur toggle state

Capture frequency change updates generator

Time & Attendance

Clock-in / Clock-out simulation
Manual time entries
Recalculate totals

Activity Monitoring

Timeline blocks:

Active

Idle

Manual

Scheduled

Derived from activityLogs.

Projects

Create project
Assign employees
Calculate:

Billable revenue

Logged hours

Milestones

Reports

Compute:

Work Type distribution

Schedule adherence

Workload distribution

App usage breakdown

Location insights

Location Tracking

Simulate GPS movement every 20 seconds.
Update:

Moving / Idle status

Geo logs

Active fleet panel

Tasks

Kanban Board must:

Create Task modal

Drag & drop between statuses

Recalculate workload

Recalculate productivity impact

Recalculate payroll billable

Payroll

Dynamically calculate:

Total Payroll =
Sum (Employee Active Hours × Hourly Rate)

Avg Hourly
Outstanding Invoices
Net Profit

Graph must update when logs change.

Compliance

Make all clickable:

Role Permissions → Updates permissions object
Encryption → Boolean state
GDPR → Retention period state
Consent → % based on employees
2FA → Boolean toggle

Badges must reflect state change.

Settings

ALL cards must open functional modals and update global state:

Alerts

API Tokens

Audit Logs

Billing

Email Reports

Integrations

Manual Time

Organization

Privacy

Security & Identity

Tracking Settings

User Management

Utilization

No dead UI elements allowed.

6. ANALYTICS ENGINE

Implement calculation functions:

Productivity % =
(Productive Time / Active Time) × 100

Utilization % =
(Active Time / Work Hours) × 100

Schedule Adherence =
(On-time Days / Total Workdays) × 100

Team Productivity =
Average member productivity

Payroll Total =
Sum of (Active Hours × Rate)

Workload Distribution =
Total Assigned Tasks per Employee

Everything must auto-recalculate on state change.

7. REALISTIC BEHAVIOR SIMULATION

Implement:

Auto-refresh interval for live modules

Random state mutation engine

Dynamic metric recalculation

Mathematical consistency

No NaN values

No broken UI

No console errors

8. CRITICAL RULES

No hardcoded data inside components

No static JSON inside pages

All buttons must function

All modals must update state

Date filters must affect data

Drag events must affect metrics

Compliance toggles must change badges

Everything interconnected

9. OUTPUT REQUIRED

Provide:

Folder structure

Zustand store

Seed generator

Analytics engine

Connected components

Clean modular architecture

Comments for clarity

This must behave like a real enterprise SaaS demo.

No placeholders.
No fake disconnected UI.
No broken flows.

Everything must work together.


















----------------------------------------------------------------------------------

integravity implementation

Zaroor! Maine pura Enterprise Workflow implement kar diya hai. Aap niche diye gaye steps ke hisaab se ek-ek karke check kar sakte hain:

1. Login & Data Seeding
Jab aap login karenge, system apne aap saara dummy data (employees, teams, tasks) generate kar dega.

Check kaise karein: Dashboard par jaate hi aapko graphs aur numbers dikhenge, iska matlab data seed ho chuka hai.
2. Organization Setup (Settings)
Maine Settings -> Organization me config set kar di hai (Timezone, Work Hours).

Check kaise karein: Settings me jaakar details fill karein, ye aage chalkar payroll aur attendance calculation ko affect karega.
3. Teams Management
Aap nayi Teams bana sakte hain (Engineering, Sales, etc.).

Check kaise karein: Teams page par jaakar "Create Team" karein. Har team ke liye productivity % dikhega.
4. Add Employees (With 30-Day History)
Sabse bada update yahan hai. Jab aap naya employee add karenge, system automatically uske pichle 30 din ke logs generate kar dega.

Check kaise karein: Employee Management me "Add Employee" form fill karein. Fir us employee ki "View" par click karke dekhein, unka activity aur attendance data pehle se bhara hua milega.
5. Create Projects & Billable Rates
Aap naye projects shuru kar sakte hain aur unhe teams ko assign kar sakte hain.

Check kaise karein: Tasks/Projects page par "Add Project" button click karein. Rate fill karein, isse Payroll me revenue reflect hoga.
6. Task Management (Kanban & Productivity)
Kanban board par tasks move karne se employee ki productivity badhti hai.

Check kaise karein: Tasks page par kisi task ko "Completed" status me move karein. Aap dekhenge ki us employee ka productivity score 15% boost ho jayega.
7. Live GPS Tracking Simulation
Maine real-time location update dal diya hai jo har 20 seconds me chalta hai.

Check kaise karein: Location Tracking page par jayein. Aapko dikhega ki employees ke coordinates badal rahe hain aur unka status "Moving" ya "Stationary" ho raha hai.
8. Dynamic Payroll
Payroll ab real-time calculatation karta hai.

Check kaise karein: Payroll page par jayein. "Total Payroll" aur "Net Profit" jaise stats aapke tasks aur projects ke hisaab se apne aap update honge.
9. Compliance & Privacy
Naya Compliance page add kiya hai jahan se aap monitoring control kar sakte hain.

Check kaise karein: Sidebar me "Compliance" par click karein. GDPR ya Location Tracking toggle off/on karke dekhein, system audit log me iski entry ho jayegi.
"Merge" Functionality Kya Hai?
Aapne pucha tha ki "Merge" kya kaam karta hai:

Agar galti se ek hi employee do baar add ho jaye (Duplicate), toh aap Merge Employees modal use kar sakte hain.
Merge From: Jise delete karna hai.
Merge Into: Jisme sara data transfer karna hai.
Iska form Employee Management page par "Merge Employees" button daba kar fill kar sakte hain.





























Maine implementation complete kar liya hai. Yeh rahi details Hinglish me:

1. Role-Based Dashboard (Backend & Frontend)
Maine dashboard ko poori tarah se role-aware bana diya hai.

Admin: Ab poore organization ka data dekh sakta hai.
Manager: Sirf apni team ka data dekh sakta hai.
Employee: Sirf apna personal metrics dekh sakta hai. Iske liye naye API endpoints banaye hain: /api/dashboard/admin, /api/dashboard/manager, aur /api/dashboard/me.
2. Data Filtering (RBAC)
Ab data visibility strictly roles ke hisaab se hai:

Teams & Employees: Managers ab sirf apne team members ko dekh sakte hain aur Employees ko sirf apna data dikhega.
Activity & Attendance: Saare reports aur logs ab auto-filter hote hain user ke role ke according.
Security: Maine EmployeesController aur 

TasksController
 me checks laga diye hain taaki sirf Admin hi employees ko invite, update, ya delete kar sake.
3. Employee Invitation Flow
Ek naya invitation system implement kiya hai:

Prisma Schema: InvitationToken model add kiya hai.
Backend Flow: Admin ab employee ko invite kar sakta hai, jisse ek secure token generate hoga.
Frontend Page: Ek naya 

SetupPassword.jsx
 page banaya hai jahan invited employees apna password set karke onboard ho sakte hain.
4. UI Updates (Frontend Restrictions)
Frontend par unnecessary buttons hide kar diye hain:

Teams Page: "Create New Team" aur Edit/Delete options ab sirf Admins ko dikhenge.
Employee Management: "Add New Employee" aur "Merge Employees" buttons ab non-admins ke liye hidden hain.