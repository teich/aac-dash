# Active Context

## Recent Changes

### Person Pages and URL Structure (Latest)
1. Added person detail pages
   - Created PersonService for person-related database operations
   - Added /person/[personId] route for viewing person details
   - Implemented person order history view
   - Added navigation between company and person pages

2. URL Structure Update
   - Changed company pages to /company/[domain]
   - Changed person pages to /person/[personId]
   - Updated all navigation links to use new URL structure
   - Components updated:
     * OrdersTable (person links)
     * CompaniesTable (company links)
     * CompanyCard (company links)
     * Person page breadcrumb

### Year Filter Implementation
1. Added year-based filtering
   - Created YearFilter component using shadcn/ui
   - Updated CompanyService for year filtering
   - Added URL parameter support
   - Integrated with existing filters

### Code Refactoring
1. Implemented Service Layer
   - Created CompanyService for database operations
   - Created PersonService for person data
   - Moved business logic out of page components
   - Added type-safe database queries

2. Type System Improvements
   - Created shared types.ts for common interfaces
   - Enhanced type safety across components
   - Better handling of nullable fields
   - Added Person and related types

3. Component Structure
   - Extracted CompanyDetails from domain page
   - Created dedicated pagination component
   - Added loading skeleton components
   - Improved component organization

4. Code Organization
   - Moved constants to separate file
   - Centralized type definitions
   - Better separation of concerns
   - Organized routes under company/ and person/ directories

## Current State
- Service layer pattern implemented for companies and people
- Type-safe database operations
- Modular component architecture
- Clear separation of concerns
- Consistent URL structure for resources

## Next Steps
1. Consider extracting more shared components
2. Add error boundaries for better error handling
3. Implement caching strategy for database queries
4. Add unit tests for service layer
5. Consider implementing data prefetching
6. Add year filtering to company detail page
7. Consider adding pagination to person order history
