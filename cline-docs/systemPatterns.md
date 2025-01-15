# System Patterns

## Architecture Patterns

### Project Structure
```
├── app/                           # Next.js app directory
│   ├── company/                   # Company-specific routes
│   │   └── [domain]/             # Dynamic company routes
│   │       ├── OrdersTable.tsx    # Company orders component
│   │       └── page.tsx          # Company detail page
│   ├── person/                    # Person-specific routes
│   │   └── [personId]/           # Dynamic person routes
│   │       └── page.tsx          # Person detail page
│   ├── components/               # App-specific components
│   │   ├── Breadcrumb.tsx
│   │   ├── CompaniesTable.tsx
│   │   ├── CompanyBreadcrumb.tsx
│   │   ├── CompanyCard.tsx
│   │   ├── CompanyCardSkeleton.tsx
│   │   ├── CompanyDetails.tsx
│   │   ├── CompanyFilters.tsx
│   │   ├── CompanyPagination.tsx
│   │   ├── Header.tsx
│   │   ├── RevenueFilter.tsx
│   │   ├── ViewToggle.tsx
│   │   └── YearFilter.tsx
│   ├── lib/                     # App-specific utilities
│   │   ├── actions.ts           # Server actions interface
│   │   ├── constants.ts         # Shared constants
│   │   ├── types.ts            # Shared TypeScript types
│   │   └── services/           # Business logic layer
│   │       ├── companyService.ts  # Company-related operations
│   │       └── personService.ts   # Person-related operations
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   └── page.tsx               # Main companies listing page
├── components/                 # Shared UI components
│   └── ui/                    # Reusable UI components
│       ├── avatar.tsx
│       ├── badge.tsx
│       ├── breadcrumb.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── command.tsx
│       ├── company-avatar.tsx
│       ├── dialog.tsx
│       ├── input.tsx
│       ├── pagination.tsx
│       ├── popover.tsx
│       ├── separator.tsx
│       └── table.tsx
├── lib/                       # Shared utilities
│   ├── db.ts                 # Database configuration
│   └── utils.ts              # Utility functions
├── public/                   # Static assets
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
└── Configuration Files       # Project configuration
    ├── .dockerignore
    ├── .gitignore
    ├── components.json
    ├── Dockerfile
    ├── eslint.config.mjs
    ├── next.config.ts
    ├── package.json
    ├── postcss.config.mjs
    ├── tailwind.config.ts
    └── tsconfig.json
```

### Architecture Patterns

1. Service Layer Pattern
   - Business logic encapsulated in services
   - Type-safe database operations
   - Centralized data access patterns
   - Error handling and logging

2. Component Architecture
   - Server Components (default)
     * Main pages
     * Data fetching components
     * Static UI components
   - Client Components (when needed)
     * Interactive UI elements
     * Components requiring browser APIs
     * Real-time updates
   - Shared Components
     * Loading states (skeletons)
     * UI patterns (cards, tables)
     * Layout components

### Data Flow Architecture

1. Database Layer (PostgreSQL)
   - Structured tables with JSONB for flexibility
   - Core Relationships:
     * Companies -> People (one-to-many)
     * People -> Orders (one-to-many)
     * Orders -> Line Items (one-to-many)
     * Line Items -> Products (many-to-one)
   
2. Service Layer (TypeScript Classes)
   - CompanyService
     * Encapsulates all company-related operations
     * Handles data transformations
     * Manages complex queries
     * Type-safe return values
   - PersonService
     * Manages person-related operations
     * Handles contact information
     * Manages person-company relationships
     * Person-specific data transformations

3. Server Actions Layer
   - Thin wrapper around services
   - Exposes server-side functionality to components
   - Handles parameter validation

4. Component Layer
   - UI Components
     * Display and user interaction
     * Loading states
     * Error boundaries
   - Data Flow
     * Server actions -> Services -> Database
     * Type-safe data throughout the stack

### Type System Architecture

1. Core Types (types.ts)
   - Database Models
     * Company
     * Person
     * Order
     * LineItem
   - Component Props
     * Company components
     * Person components
     * Shared UI components
   - API Responses
     * Company responses
     * Person responses
     * Order data
   - Service Interfaces
     * CompanyService
     * PersonService

2. Type Safety Patterns
   - Strict null checking
   - Required vs optional fields
   - Union types for variants
   - Type guards for runtime checks

## Key Technical Decisions

### Database Design
- Use of JSONB for enrichment data to allow flexible schema evolution
- Fully normalized structure for core entities:
  * Companies: Central business entities with enrichment data
  * People: Contact information and company association
  * Orders: Transaction records with total amounts
  * Line Items: Detailed order contents with pricing
  * Products: Product catalog with SKUs
- Key design decisions:
  * JSONB for flexible company enrichment data
  * Required foreign keys ensure data integrity
  * Timestamps for audit trails
  * Numeric type for monetary values
  * Text type for flexible string storage
- Consumer domain filtering at query level

### Performance Optimizations
- Server-side pagination
- Efficient SQL queries with proper joins:
  * Join companies -> people for contact info
  * Join people -> orders for sales data
  * Join orders -> line_items -> products for details
- Aggregate queries for:
  * Total order amounts per company
  * Product sales analysis
  * Customer purchase history
- Suspense for progressive loading
- Skeleton loading states

### UI Component Structure
- Shared UI components in /components/ui
- Business components in app/components
- Dynamic routing for company-specific pages

### State Management
- URL-based state for filters and pagination
- Server-side state management
- Minimal client-side state

## Coding Patterns

### TypeScript Patterns
- Strong typing for database models
- Type-safe server actions
- Component prop interfaces
- URL params validation

### Component Patterns
- Composition over inheritance
- Shared UI component library
- Loading state handling with suspense
- Error boundary implementation

### Database Patterns
- Parameterized queries for security
- Efficient joins and aggregations
- Consumer domain filtering
- Proper error handling
