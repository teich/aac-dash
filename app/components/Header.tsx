import Link from 'next/link'

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" className="font-semibold text-xl">
            AAC Customer Insight
          </Link>
        </div>
      </div>
    </header>
  )
} 