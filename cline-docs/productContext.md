# Product Context

## Purpose
AAC-Dash is a business analytics dashboard that provides insights into company data, orders, and sales performance.

## Problems Solved
- Provides a centralized view of company information and performance metrics
- Enables filtering and searching through company data
- Displays detailed company information including revenue, employees, and sales data
- Excludes consumer domains to focus on business entities
- Supports pagination for handling large datasets

## How It Works
1. Data is stored in PostgreSQL database with tables for:
   - Companies (with enrichment data)
   - People
   - Orders

2. Main Features:
   - Company listing with search functionality
   - Industry filtering
   - Consumer site filtering
   - Pagination
   - Detailed company cards showing:
     - Basic info (name, domain)
     - Financial data (revenue)
     - Employee count
     - Industry information
     - Location data
     - Sales metrics
     - Order statistics

3. User Interface:
   - Clean, modern interface built with Next.js and Tailwind CSS
   - Responsive grid layout
   - Search bar with instant filtering
   - Industry and consumer site toggle filters
   - Pagination controls
