import Link from 'next/link';
import { getPersonById } from '@/app/lib/actions';
import { OrdersTable } from '../../company/[domain]/OrdersTable';

type PageProps = {
  params: Promise<{ personId: string }>;
};

export default async function PersonPage({ params }: PageProps) {
  const resolvedParams = await params;
  const personData = await getPersonById(resolvedParams.personId);

  if (!personData) {
    return <div>Person not found</div>;
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-500">
        <Link 
          href={`/company/${personData.company_domain}`}
          className="hover:text-gray-700"
        >
          {personData.company_name}
        </Link>
        <span>/</span>
        <span className="text-gray-900">{personData.name}</span>
      </nav>

      {/* Person Details */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">{personData.name}</h1>
          <div className="flex items-center space-x-4">
            <div className="text-sm">
              <div className="text-gray-500">Total Orders</div>
              <div className="font-medium">{personData.total_orders}</div>
            </div>
            <div className="text-sm">
              <div className="text-gray-500">Total Sales</div>
              <div className="font-medium">${parseFloat(personData.total_sales).toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">Order History</h2>
        <OrdersTable data={personData.orders} />
      </div>
    </div>
  );
}
