# Technical Context

## Technologies Used

### Frontend
- Next.js 15.1.4 with App Router
- React 19
- TypeScript
- Tailwind CSS for styling
- Radix UI components
- Lucide React for icons
- TanStack Table for data tables
- Recharts for data visualization

### Backend
- Next.js Server Components/Actions
- PostgreSQL database
- Node-Postgres (pg) for database connectivity

## Development Setup
1. Environment Variables Required:
   - POSTGRES_HOST
   - POSTGRES_PORT (defaults to 5432)
   - POSTGRES_USER
   - POSTGRES_PASSWORD
   - POSTGRES_DB

2. Development Commands:
   ```bash
   pnpm dev        # Start development server with Turbopack
   pnpm build      # Build for production
   pnpm start      # Run production server
   pnpm lint       # Run ESLint
   ```

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
