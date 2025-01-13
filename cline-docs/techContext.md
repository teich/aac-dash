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
- Companies table with JSONB enrichment_data containing:
  - about (industry, employees, year founded)
  - finances (revenue)
  - descriptions
  - analytics (monthly visitors)
  - locations (headquarters)
  - assets (logo)
- People table linked to companies
- Orders table linked to people

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
