# System Patterns

## Architecture Patterns

### Next.js App Router Structure
```
app/
├── [domain]/              # Dynamic routes for company-specific pages
│   ├── OrdersTable.tsx    # Company orders component
│   └── page.tsx          # Company detail page
├── components/           # Shared components
│   ├── Breadcrumb.tsx
│   ├── CompanyBreadcrumb.tsx
│   ├── CompanyCard.tsx
│   └── Header.tsx
├── lib/                 # Server-side utilities
│   └── actions.ts       # Server actions for data fetching
└── page.tsx            # Main companies listing page
```

### Component Architecture
1. Server Components (default)
   - Main pages
   - Data fetching components
   - Static UI components

2. Client Components (when needed)
   - Interactive UI elements
   - Components requiring browser APIs
   - Real-time updates

### Data Flow
1. Database Layer
   - PostgreSQL with structured tables
   - JSONB for flexible enrichment data
   - Core Relationships:
     * Companies -> People (one-to-many)
     * People -> Orders (one-to-many)
     * Orders -> Line Items (one-to-many)
     * Line Items -> Products (many-to-one)
   - Data hierarchy:
     1. Companies (root entity)
        - Enrichment data in JSONB for flexibility
        - Stores company metadata and analytics
     2. People (company contacts)
        - Linked to companies via company_id
        - Stores contact and address information
     3. Orders (sales transactions)
        - Linked to people via person_id
        - Tracks order date and total amount
     4. Line Items (order details)
        - Linked to orders via order_id
        - Linked to products via product_id
        - Stores quantity and pricing details
     5. Products (catalog)
        - Referenced by line items
        - Stores product information and SKUs

2. Server Actions
   - Centralized data fetching in actions.ts
   - Type-safe database queries
   - Error handling and logging

3. UI Layer
   - Server-side rendering for initial data
   - Client-side filtering and pagination
   - Suspense boundaries for loading states

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
