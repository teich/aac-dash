### Frontend Architecture
- Next.js 15.1.4 with App Router
- React 19
- TypeScript with strict mode
- Tailwind CSS for styling
- Component Libraries:
  * Radix UI for accessible primitives
  * shadcn/ui for styled components
  * Lucide React for icons
  * TanStack Table for data tables

### Development Patterns
- Service Layer for business logic
- Type-safe database operations
- Component-based architecture
- Server-side rendering with streaming
- Progressive loading with Suspense
- URL-based state management

### Component Guidelines
- Use shadcn components when available
  * Add new components: `pnpm dlx shadcn@latest add [component-name]`
  * Check existing components before custom implementations
- Prefer server components by default
- Use client components only when needed:
  * Interactive features
  * Browser APIs
  * Real-time updates


### Backend Architecture
- Next.js Server Components/Actions
- PostgreSQL database with JSONB support
- Database Access:
  * Node-Postgres (pg) for raw queries
  * Service layer for business logic
  * Type-safe database operations
- Package Management:
  * pnpm for dependency management
  * Strict versioning for stability

## Development Setup

### Environment Configuration
1. Required Variables:
   ```
   POSTGRES_HOST=
   POSTGRES_PORT=5432  # default
   POSTGRES_USER=
   POSTGRES_PASSWORD=
   POSTGRES_DB=
   ```

2. Development Workflow:
   ```bash
   # Development
   pnpm dev        # Start development server with Turbopack
   pnpm lint       # Run ESLint

   # Production
   pnpm build      # Build for production
   pnpm start      # Run production server
   ```

3. Type Safety:
   - Enable strict mode in tsconfig
   - Run type checks before commits
   - Maintain type definitions

## Technical Constraints

### Database Schema

#### Companies Table
- id: integer (PK, auto-increment)
- name: text (required)
- domain: text
- linkedin_url: text
- enrichment_data: jsonb - Contains:
  - about (industry, employees, year founded)
  - finances (revenue)
  - descriptions
  - analytics (monthly visitors)
  - locations (headquarters)
  - assets (logo)
- enrichment_source: text
- enriched_date: timestamp with time zone
- created_at: timestamp with time zone (default: CURRENT_TIMESTAMP)
- updated_at: timestamp with time zone (default: CURRENT_TIMESTAMP)

#### People Table
- id: integer (PK, auto-increment)
- name: text (required)
- email: text (required)
- phone: text
- address: text
- city: text
- state: text
- zip: text
- country: text
- company_id: integer (FK to companies.id, required)
- created_at: timestamp with time zone (default: CURRENT_TIMESTAMP)
- updated_at: timestamp with time zone (default: CURRENT_TIMESTAMP)

#### Orders Table
- id: integer (PK, auto-increment)
- person_id: integer (FK to people.id, required)
- date: date (required)
- amount: numeric (required)
- invoice_number: text
- created_at: timestamp with time zone (default: CURRENT_TIMESTAMP)
- updated_at: timestamp with time zone (default: CURRENT_TIMESTAMP)

#### Line Items Table
- id: integer (PK, auto-increment)
- order_id: integer (FK to orders.id, required)
- product_id: integer (FK to products.id, required)
- unit_price: numeric (required)
- quantity: integer (required)
- amount: numeric (required)
- created_at: timestamp with time zone (default: CURRENT_TIMESTAMP)
- updated_at: timestamp with time zone (default: CURRENT_TIMESTAMP)

#### Products Table
- id: integer (PK, auto-increment)
- name: text (required)
- description: text
- sku: text (required)
- created_at: timestamp with time zone (default: CURRENT_TIMESTAMP)
- updated_at: timestamp with time zone (default: CURRENT_TIMESTAMP)

### Performance Considerations
- Server-side rendering for initial page load
- Suspense boundaries for loading states
- Pagination with configurable page size
- Efficient SQL queries with proper indexing
- Consumer domain filtering for focused business data

### Security
- Environment variables for sensitive data
- Server-side data fetching
- Input sanitization for search queries
- Type safety with TypeScript

### UI/UX
- Responsive design (mobile-first)
- Loading skeletons for better UX
- Clear filtering and search mechanisms
- Accessible components using Radix UI
