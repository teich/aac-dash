import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

interface BreadcrumbProps {
  items: {
    label: string
    href: string
  }[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
      <Link
        href="/"
        className="hover:text-foreground transition-colors"
      >
        Home
      </Link>
      {items.map((item, index) => (
        <span key={item.href} className="flex items-center space-x-1">
          <ChevronRight className="h-4 w-4" />
          <Link
            href={item.href}
            className="hover:text-foreground transition-colors"
          >
            {item.label}
          </Link>
        </span>
      ))}
    </nav>
  )
} 