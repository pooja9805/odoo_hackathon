🚚 FleetFlow – Modular Fleet & Logistics Management System

FleetFlow is a full-stack fleet and logistics management platform built for the Odoo Hackathon.
It replaces manual logbooks with a centralized, rule-based digital hub to manage vehicles, drivers, trips, maintenance, fuel expenses, and operational analytics.

The system supports role-based access, real-time fleet status updates, financial tracking, and performance monitoring.

✨ Key Features
🔐 Authentication & RBAC

Login & Register

JWT-based authentication

Role-Based Access Control:

Manager

Dispatcher

Safety Officer

Finance Analyst

📊 Command Center Dashboard

Active Fleet (On Trip vehicles)

Maintenance Alerts (In Shop vehicles)

Utilization Rate

Pending Trips

Quick navigation buttons

Search & filters

🚘 Vehicle Registry

Add / Update / Delete vehicles

Vehicle status:

Available

In Shop

Retired

Capacity & odometer tracking

Search, sort & filter

🧭 Trip Dispatcher

Create trips with:

Vehicle

Driver

Cargo

Origin / Destination

Distance

Estimated Fuel

Validation:

Cargo ≤ Vehicle Capacity

Driver must be On Duty

Vehicle must be Available

Trip lifecycle:

Draft → Dispatched → Completed → Cancelled

Auto status updates:

Driver & Vehicle → On Trip / Available

🛠 Maintenance Logs

Add service records

Vehicle auto-switches to In Shop

Search / filter / sort

Date tracking

Issue & cost logging

⛽ Fuel & Expense Logging

Record liters, cost, vehicle & trip

Expense history table

Used for analytics calculations

👨‍✈️ Driver Performance & Safety

Add drivers

License expiry tracking

Status:

On Duty

Break

Suspended

Safety score

Completion rate

Complaints

Role-based access enforcement

📈 Analytics & Reports

Fuel Efficiency (km/L)

Cost per km

ROI

Total fuel, maintenance & revenue

CSV export for reports

🧠 Workflow Example

Manager adds vehicle → status: Available

Manager adds driver → status: On Duty

Dispatcher creates trip

System validates cargo & license

Vehicle + Driver → On Trip

Trip completed → Vehicle + Driver → Available

Maintenance logged → Vehicle → In Shop

Fuel added → Analytics updated automatically

🛠 Tech Stack
Frontend

React (Vite)

Axios

Bootstrap

SweetAlert2

Backend

Node.js

Express

Prisma ORM

JWT Authentication

Database

MySQL

📂 Project Structure
fleet/
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── prisma/
│   └── server.js
│
└── frontend/
    ├── src/pages/
    ├── src/api.js
    └── App.jsx
⚙️ Setup Instructions
Backend
cd backend
npm install
npx prisma db push
npm run dev

Create .env:

DATABASE_URL="mysql://user:password@localhost:3306/FLEET"
JWT_SECRET=your_secret
Frontend
cd frontend
npm install
npm run dev

Frontend runs at:

http://localhost:5173

Backend runs at:

http://localhost:5000
🔑 Roles Summary
Role	Permissions
Manager	Vehicles, Drivers, Maintenance
Dispatcher	Trips
Safety	Driver Status
Finance	Analytics
🏆 Hackathon Highlights

Full RBAC implementation

Real-time fleet availability logic

Automated status transitions

Financial analytics

Clean UI with modals, filters & validations

Fully relational schema (Trips ↔ Vehicles ↔ Drivers ↔ Fuel ↔ Maintenance)

👩‍💻 Developed By:
Pooja Liladhar Bagul
