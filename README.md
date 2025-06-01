## Project Overview

This project is a comprehensive Equipment Rental Management Dashboard developed for ENTNT as part of the Frontend Developer technical assignment. The system provides a complete solution for managing equipment inventory, rental orders, maintenance records, and includes a feature-rich dashboard with KPIs, charts, and real-time notifications. 

**Important Note:** This is a frontend-only application with no backend services. All data is stored and managed using browser localStorage to simulate a complete database system.

## Live Demo

**Deployed Application:** [[Link](https://equipment-retail-management.vercel.app/)]  


## Core Features

### User Authentication (Simulated)
- Role-based login system with three user types: Admin, Staff, Customer
- Session persistence using localStorage
- Frontend role-based access control with different permissions per role

### Equipment Inventory Management
- Complete CRUD operations for equipment items
- Advanced filtering and search capabilities
- Equipment status tracking (Available, Rented, Under Maintenance, Out of Service)
- Role-based action permissions (View, Edit, Delete, Create)

### Rental Orders Management
- Create rental orders with customer, equipment, and date selection
- Comprehensive filtering by status, customer, and equipment
- Real-time status updates (Reserved, Rented, Returned, Cancelled)
- Equipment availability validation

### Maintenance Records Management
- Add, edit, and view maintenance records
- Equipment-specific maintenance history
- Maintenance type categorization and status tracking

### Calendar View for Rentals
- Interactive monthly calendar displaying rental schedules
- Click-to-view rental details for specific dates
- Visual rental status indicators

### Notification Center
- Real-time in-app notifications for new rentals, returns, and maintenance scheduling
- Dismissible notification system with auto-dismiss functionality

### KPIs Dashboard
- Comprehensive metrics: Total Equipment, Available vs Rented, Overdue Rentals, Upcoming Maintenance
- Interactive data visualization with charts (pie, bar, line charts)
- Export functionality for CSV and JSON formats

### Additional Features
- Complete dark mode implementation with user preference persistence
- Fully responsive design across all device sizes
- Data export capabilities for reports and analytics

## Technologies Used

- **Frontend Framework:** React 18 (Functional Components with Hooks)
- **Routing:** React Router v7
- **State Management:** Context API with custom hooks
- **Styling:** Tailwind CSS v4 with dark mode support
- **Charts:** Recharts for data visualization
- **Build Tool:** Vite
- **Deployment:** Vercel

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository:**

git clone [https://github.com/Rohanmaan32/EquipmentRetailManagement.git]
cd equipmentrentalmanagement


2. **Install dependencies:**

npm install

3. **Start the development server:**

npm run dev


4. **Build for production:**

npm run build


## Login Credentials

The application includes three pre-configured user accounts:

| Role | Email | Password | Permissions |
|------|-------|----------|-------------|
| Admin | admin@entnt.in | admin123 | Full access (Create, Edit, Delete, View) |
| Staff | staff@entnt.in | staff123 | Edit and View permissions |
| Customer | customer@entnt.in | cust123 | View-only permissions |

## Data Storage

**No Backend Required:** This application uses browser localStorage to simulate a complete database system. All data including users, equipment, rentals, maintenance records, and user sessions are stored locally in the browser. The data persists between sessions but will be lost if browser data is cleared.

Sample data is automatically loaded on first use to demonstrate all features.

## Architecture Overview

### State Management
- Context API pattern with separate contexts for each major feature
- Custom hooks for clean component integration
- Automatic localStorage persistence and retrieval

### Component Architecture
- Modern React functional components with hooks
- Protected routes with role-based access control
- Responsive design with mobile-first approach

## Key Technical Decisions

- **React Router v7:** Modern routing with framework features
- **Context API over Redux:** Lightweight state management suitable for application scale
- **Tailwind CSS:** Rapid development with consistent design system
- **localStorage Simulation:** Complete data persistence without backend complexity

## Known Limitations

- All data is stored in localStorage and will be lost if browser data is cleared
- Frontend-only authentication simulation without real security
- No real-time synchronization between browser tabs

## Deployment

The application is deployed on Vercel with React Router v7 SSR support. The deployment automatically updates when changes are pushed to the main branch.

---