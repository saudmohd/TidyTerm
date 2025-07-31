# Replit.md

## Overview

This is a full-stack legal document generation platform called "TidyTerms" that helps creators (particularly for platforms like Gumroad, Carrd, and Notion) generate professional Terms of Service and Privacy Policy documents. The application features a React frontend with a Node.js/Express backend, using PostgreSQL with Drizzle ORM for data persistence and Stripe for payment processing.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Library**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **Authentication**: Session-based authentication with Replit Auth integration

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js for REST API
- **Authentication**: Passport.js with OpenID Connect for Replit authentication
- **Session Management**: Express sessions with PostgreSQL storage
- **Payment Processing**: Stripe integration for subscription management

### Data Storage
- **Database**: PostgreSQL with Neon serverless driver
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Location**: Shared schema definitions in `/shared/schema.ts`
- **Migrations**: Managed through Drizzle Kit

## Key Components

### Database Schema
- **Users**: Store user profile information, Stripe customer data, and subscription status
- **Platforms**: Supported platforms (Gumroad, Carrd, Notion, etc.)
- **Templates**: Legal document templates with platform-specific customizations
- **Documents**: Generated documents with sharing capabilities and view tracking
- **Sessions**: Session storage for authentication

### Authentication Flow
- Replit OpenID Connect integration for user authentication
- Session-based authentication with PostgreSQL session store
- User profile management with Stripe customer integration

### Document Generation System
- Multi-step form wizard for collecting business information
- Template processing with variable substitution
- Platform-specific document customization
- Public document sharing with unique tokens

### Payment Integration
- Stripe subscription management
- Free tier with premium upgrade options
- Customer portal integration for subscription management

## Data Flow

1. **User Authentication**: Users authenticate via Replit OAuth, creating/updating user records
2. **Document Generation**: Users select platform → provide business info → customize policies → generate document
3. **Template Processing**: Backend processes templates with user variables and generates final documents
4. **Document Storage**: Generated documents stored with sharing tokens for public access
5. **Payment Processing**: Stripe handles subscription upgrades and billing

## External Dependencies

### Payment Processing
- **Stripe**: Handles all payment processing, subscription management, and customer billing
- Required environment variables: `STRIPE_SECRET_KEY`, `VITE_STRIPE_PUBLIC_KEY`

### Authentication
- **Replit Auth**: Provides OAuth authentication for user login
- Required environment variables: `REPLIT_DOMAINS`, `ISSUER_URL`, `SESSION_SECRET`

### Database
- **Neon Database**: PostgreSQL hosting with serverless capabilities
- Required environment variables: `DATABASE_URL`

### Development Tools
- **Vite**: Frontend build tool with React plugin
- **Replit Plugins**: Development-specific tooling for the Replit environment

## Deployment Strategy

### Build Process
- Frontend: Vite builds optimized production bundle to `/dist/public`
- Backend: ESBuild bundles server code to `/dist/index.js`
- Database: Drizzle Kit manages schema migrations

### Environment Configuration
- Development: Uses Vite dev server with Express backend proxy
- Production: Serves static files from Express with API routes
- Database: Automatic schema synchronization via Drizzle

### Scaling Considerations
- Session storage in PostgreSQL allows horizontal scaling
- Neon serverless database auto-scales with usage
- Stateless backend design enables multiple server instances

The application follows a typical SaaS pattern with freemium model, focusing on simplicity for non-technical users while maintaining professional legal document quality through expert-crafted templates.