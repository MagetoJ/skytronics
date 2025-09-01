# PC Today Electronics E-Commerce Platform

## Overview

PC Today is a full-stack e-commerce web application built for selling electronics in the Kenyan market, specifically targeting Nairobi customers. The platform features a modern React frontend with a Node.js/Express backend, utilizing PostgreSQL for data persistence. The application supports both customer-facing shopping experiences and comprehensive admin management capabilities, with Progressive Web App (PWA) features for enhanced mobile accessibility.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client-side application is built with React using functional components and hooks, organized in a modular structure under the `client/` directory. The frontend implements:

- **Component-based architecture** using a combination of custom components and shadcn/ui design system components
- **Client-side routing** via Wouter for navigation between pages
- **State management** through React Context API for authentication (AuthContext) and shopping cart (CartContext)
- **Styling framework** using Tailwind CSS with custom CSS variables for theming
- **Form handling** with React Hook Form and Zod validation schemas
- **Data fetching** powered by TanStack React Query for server state management

### Backend Architecture
The server-side implementation follows a REST API pattern built with Express.js:

- **RESTful API design** with route handlers organized in `/server/routes.ts`
- **Authentication system** using JWT tokens with role-based access control (user, standard_admin, main_admin)
- **Database abstraction layer** through a storage interface pattern in `/server/storage.ts`
- **Middleware implementation** for authentication, authorization, and request logging
- **Development tooling** with Vite integration for hot module replacement

### Database Design
The application uses PostgreSQL with Drizzle ORM for type-safe database operations:

- **Schema-first approach** with all table definitions in `/shared/schema.ts`
- **Relational data model** supporting users, products, orders, order items, reviews, wishlists, and admin activity logs
- **Type safety** through Drizzle's TypeScript integration and Zod validation schemas
- **Migration support** via Drizzle Kit for schema evolution

### Authentication & Authorization
Multi-tier security implementation:

- **JWT-based authentication** with secure token storage in localStorage
- **Role-based access control** supporting three user levels: regular users, standard admins, and main admins
- **Security key requirement** for admin access beyond standard login credentials
- **Protected routes** with middleware validation for API endpoints and frontend route guards

### PWA Features
Enhanced mobile experience through Progressive Web App capabilities:

- **App manifest** configuration in `/client/public/manifest.json` for home screen installation
- **Service worker** implementation for offline caching and performance optimization
- **Responsive design** optimized for mobile and desktop experiences

### SEO & Content Management
Search engine optimization and content discoverability:

- **Dynamic meta tag generation** for product and category pages
- **Sitemap generation** through backend API endpoints
- **Robots.txt serving** for search engine crawler guidance
- **Semantic HTML structure** with proper heading hierarchy and alt text

## External Dependencies

### Database & ORM
- **Neon Database** (@neondatabase/serverless) - Serverless PostgreSQL hosting platform
- **Drizzle ORM** - Type-safe database toolkit with PostgreSQL dialect support

### Frontend Libraries
- **Radix UI** - Comprehensive component library for accessible UI primitives
- **Tailwind CSS** - Utility-first CSS framework for styling
- **TanStack React Query** - Data fetching and server state management
- **Wouter** - Minimalist client-side routing solution
- **React Hook Form** - Performance-focused form library

### Backend Dependencies
- **Express.js** - Web application framework for Node.js
- **bcrypt** - Password hashing library for secure authentication
- **jsonwebtoken** - JWT implementation for token-based authentication

### Development Tools
- **Vite** - Build tool and development server with HMR support
- **TypeScript** - Type safety across the entire application stack
- **ESBuild** - Fast JavaScript bundler for production builds

### Third-party Services
- **Font Awesome** - Icon library loaded via CDN
- **Google Fonts** - Web font service for Inter font family
- **Replit Development Banner** - Development environment integration