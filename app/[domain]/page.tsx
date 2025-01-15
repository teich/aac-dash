import { CompanyBreadcrumb } from '@/app/components/CompanyBreadcrumb';
import { CompanyDetails } from '@/app/components/CompanyDetails';
import { OrdersTable } from './OrdersTable';
import { getCompanyByDomain } from '@/app/lib/actions';

type PageProps = {
  params: Promise<{ domain: string }>;
};

export default async function CompanyPage({ params }: PageProps) {
  const resolvedParams = await params;
  const companyData = await getCompanyByDomain(resolvedParams.domain);

  if (!companyData) {
    return <div>Company not found</div>;
  }

  return (
    <div className="space-y-6">
      <CompanyBreadcrumb 
        domain={companyData.domain} 
        companyName={companyData.enrichment_data?.about?.name || companyData.company_name || companyData.name}
      />
      
      <CompanyDetails company={companyData} />

      {/* Orders Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Orders</h2>
        <OrdersTable data={companyData.orders} />
      </div>
    </div>
  );
}
