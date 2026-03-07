You are a Senior SaaS Backend Architect.

The project is an Employee Monitoring SaaS similar to Insightful.io.

Tech Stack

Backend

Node.js
Express
Prisma
MySQL
JWT
Socket.IO

Frontend

React
Vite
Zustand
Axios
Socket.IO Client

Existing Modules

Authentication
Organizations
Teams
Employees
Activity Logs
Screenshot Monitoring
Productivity Analytics
Attendance
Projects
Tasks
Reports
Payroll

Implement STEP-14 → Real-Time Monitoring Engine

⚠️ Rules

Do NOT modify UI.
Use existing frontend pages.
Remove any mock live data.
All live data must come from backend.

Core Real-Time Features

System must support:

Live employee status
Live activity tracking
Live application usage
Live screenshots
Live productivity stream

Real-Time Employee Status

Employees can be:

ONLINE
IDLE
OFFLINE

Logic:

lastActivity < 1 minute → ONLINE
lastActivity < 5 minutes → IDLE
> 5 minutes → OFFLINE

Store status in memory cache.

Create Prisma Model
Live Activity Model
model LiveActivity {
  id            String   @id @default(uuid())

  employeeId    String
  organizationId String

  activeApp     String
  activeWindow  String

  keystrokes    Int
  mouseClicks   Int

  idleTime      Int

  createdAt     DateTime @default(now())

  employee      Employee @relation(fields:[employeeId], references:[id])
}
WebSocket Server

Use Socket.IO.

Create server:

socket/server.js

Initialize socket server with Express.

Employees connect to socket after login.

Socket Events
Employee Connect
employee:connect

Store employee session.

Send Activity
employee:activity

Data sent every 10 seconds.

Payload:

employeeId
activeApp
activeWindow
keystrokes
mouseClicks
idleTime

Store in LiveActivity.

Send Screenshot
employee:screenshot

Store screenshot metadata in Screenshot table.

Employee Disconnect
employee:disconnect

Mark employee OFFLINE.

Live Monitoring APIs
Get Online Employees
GET /api/monitoring/online

Return all currently active employees.

Get Live Activity Feed
GET /api/monitoring/live-feed

Return latest activities.

Get Employee Live Data
GET /api/monitoring/employee/:id

Return:

current app
current window
idle time
keystrokes
mouse clicks

Real-Time Dashboard

Admin dashboard must show:

Online employees
Idle employees
Active applications
Live screenshots

Activity Stream

Admin must see live updates:

John → Using VS Code
Sarah → Idle 2 minutes
Alex → Browsing Chrome

Data must stream via WebSocket.

Frontend Connectivity

Update pages:

RealTimeInsights.jsx
LiveEmployees.jsx
ActivityFeed.jsx
ScreenshotMonitoring.jsx

Use Socket.IO client.

Example connection:

const socket = io(API_URL)

Listen events:

socket.on("activity_update")
socket.on("employee_status")
Live Monitoring Flow

Employee Agent
↓
Capture activity
↓
Send WebSocket event
↓
Backend stores LiveActivity
↓
Admin Dashboard updates instantly

Performance Optimization

Store live sessions in memory.

Use database only for:

activity logs
screenshots
reports

Security

Socket connections must use JWT authentication.

Example:

socket.handshake.auth.token

Validate token before connecting.

Success Result

System must support:

Live employee monitoring
Real-time activity tracking
Live application tracking
Live screenshots
Instant admin dashboard updates

All real-time data must sync using WebSockets.