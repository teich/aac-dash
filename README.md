# AAC-Dash

AAC-Dash is a modern business analytics dashboard built with Next.js that provides comprehensive insights into company data, orders, and sales performance. It offers a centralized view of business metrics with powerful filtering and search capabilities.

## Features

- 🏢 **Company Analytics**: Detailed company profiles with enriched data
- 📊 **Performance Metrics**: Revenue tracking and sales analytics
- 🔍 **Advanced Filtering**: Industry-based filters and consumer domain exclusion
- 📱 **Responsive Design**: Modern UI built with Tailwind CSS and shadcn/ui
- 🚀 **High Performance**: Server-side rendering with streaming support
- 📦 **Type Safety**: Full TypeScript support with strict mode enabled

## Tech Stack

- **Framework**: Next.js 15.1.4 with App Router
- **Language**: TypeScript
- **Database**: PostgreSQL with JSONB support
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui, Radix UI
- **Data Tables**: TanStack Table
- **Package Manager**: pnpm

## Getting Started

1. **Clone the repository**

```bash
git clone [repository-url]
cd aac-dash
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Configure environment variables**

Create a `.env` file in the root directory:

```env
POSTGRES_HOST=
POSTGRES_PORT=5432
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=
```

4. **Start the development server**

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## Development

```bash
# Run ESLint
pnpm lint

# Build for production
pnpm build

# Start production server
pnpm start
```

## Database Schema

The application uses PostgreSQL with the following main tables:

- **Companies**: Stores business information with enrichment data
- **People**: Manages individual contact records
- **Orders**: Tracks sales and transaction data
- **Products**: Product catalog information
- **Line Items**: Detailed order item records

Each table includes timestamps for creation and updates, with proper foreign key relationships maintained.
