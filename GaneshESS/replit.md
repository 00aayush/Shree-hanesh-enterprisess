# Employee Management System

## Overview

This is a modern employee management system built for Shree Ganesh Enterprises, specifically designed for managing HVAC technicians and their projects. The application provides comprehensive tools for tracking employees, managing projects, monitoring attendance, and generating reports. It features a clean, responsive interface built with React and shadcn/ui components, backed by a Node.js/Express API with PostgreSQL database storage.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18+ with TypeScript
- **Routing**: Wouter for client-side routing
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with JSON responses
- **Database**: PostgreSQL with Drizzle ORM
- **Schema Validation**: Zod schemas shared between client and server
- **Storage Pattern**: Repository pattern with in-memory storage for development

### Database Design
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema**: Three main entities - employees, projects, and attendance
- **Employee Fields**: Personal info, role (technician/supervisor/sales/admin), specialization (chiller/compressor/ac/general), status tracking
- **Project Fields**: Name, location, type (mall/office/company), assigned employees, date tracking
- **Attendance Fields**: Employee tracking with check-in/out times, location, and status

### Key Features
- **Employee Management**: CRUD operations with search and filtering by role, specialization, and status
- **Dashboard**: Real-time statistics showing total employees, active projects, on-site count, and pending tasks
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Form Validation**: Client and server-side validation using Zod schemas
- **Export Functionality**: CSV export capabilities for employee data

## External Dependencies

### Database
- **Neon Database**: Serverless PostgreSQL database via `@neondatabase/serverless`
- **Drizzle Kit**: Database migrations and schema management

### UI Components
- **Radix UI**: Complete set of accessible UI primitives (@radix-ui/react-*)
- **Lucide React**: Icon library for consistent iconography
- **Embla Carousel**: Touch-friendly carousel component

### Development Tools
- **Replit Integration**: Custom Vite plugins for Replit development environment
- **ESBuild**: Fast bundling for production server builds
- **PostCSS**: CSS processing with Tailwind CSS

### Utility Libraries
- **Class Variance Authority**: Type-safe component variants
- **clsx & tailwind-merge**: Conditional CSS class handling
- **date-fns**: Date manipulation and formatting
- **nanoid**: Unique ID generation

The application uses a modern tech stack optimized for developer experience and production performance, with special consideration for HVAC industry requirements like specialized roles and project types.