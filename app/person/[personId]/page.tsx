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
        <div className="space-y-2">
          {/* Contact Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-sm">
              <div className="text-gray-500">Email</div>
              <div className="font-medium">{personData.email}</div>
            </div>
            {personData.enrichment_data?.data.work_email && (
              <div className="text-sm">
                <div className="text-gray-500">Work Email</div>
                <div className="font-medium">{personData.enrichment_data.data.work_email}</div>
              </div>
            )}
            {personData.enrichment_data?.data.mobile_phone && (
              <div className="text-sm">
                <div className="text-gray-500">Mobile Phone</div>
                <div className="font-medium">{personData.enrichment_data.data.mobile_phone}</div>
              </div>
            )}
            {personData.enrichment_data?.data.location_street_address && (
              <div className="text-sm col-span-2">
                <div className="text-gray-500">Address</div>
                <div className="font-medium">
                  {personData.enrichment_data.data.location_street_address}
                  {personData.enrichment_data.data.location_postal_code && (
                    <span className="ml-1">
                      {personData.enrichment_data.data.location_postal_code}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enriched Data Section */}
      {personData.enrichment_data?.data && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight">Professional Details</h2>
          
          <div className="grid grid-cols-2 gap-6">
            {/* Skills Section */}
            {personData.enrichment_data.data.skills && personData.enrichment_data.data.skills.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-medium text-gray-700">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {personData.enrichment_data.data.skills.map((skill) => (
                    <span 
                      key={skill}
                      className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Location Section */}
            {personData.enrichment_data.data.location_name && (
              <div className="space-y-2">
                <h3 className="font-medium text-gray-700">Location</h3>
                <div className="text-sm text-gray-600">
                  {personData.enrichment_data.data.location_name}
                </div>
              </div>
            )}

            {/* Experience Section */}
            {personData.enrichment_data.data.experience && personData.enrichment_data.data.experience.length > 0 && (
              <div className="col-span-2 space-y-3">
                <h3 className="font-medium text-gray-700">Experience</h3>
                <div className="space-y-4">
                  {personData.enrichment_data.data.experience
                    .sort((a, b) => {
                      if (a.is_primary) return -1;
                      if (b.is_primary) return 1;
                      return 0;
                    })
                    .map((exp, index) => (
                      <div key={index} className="space-y-1">
                        <div className="font-medium text-sm">{exp.title.name}</div>
                        <div className="text-sm text-gray-600">
                          {exp.company.name}
                          {exp.company.location?.name && ` • ${exp.company.location.name}`}
                        </div>
                        {(exp.start_date || exp.end_date) && (
                          <div className="text-sm text-gray-500">
                            {exp.start_date && new Date(exp.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                            {exp.end_date ? ` - ${new Date(exp.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}` : ' - Present'}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Education Section */}
            {personData.enrichment_data.data.education && personData.enrichment_data.data.education.length > 0 && (
              <div className="col-span-2 space-y-3">
                <h3 className="font-medium text-gray-700">Education</h3>
                <div className="space-y-4">
                  {personData.enrichment_data.data.education.map((edu, index) => (
                    <div key={index} className="space-y-1">
                      <div className="font-medium text-sm">{edu.school.name}</div>
                      {edu.school.location?.name && (
                        <div className="text-sm text-gray-600">{edu.school.location.name}</div>
                      )}
                      {edu.degrees && edu.degrees.length > 0 && (
                        <div className="text-sm text-gray-600">{edu.degrees.join(', ')}</div>
                      )}
                      {(edu.start_date || edu.end_date) && (
                        <div className="text-sm text-gray-500">
                          {edu.start_date && new Date(edu.start_date).toLocaleDateString('en-US', { year: 'numeric' })}
                          {edu.end_date && ` - ${new Date(edu.end_date).toLocaleDateString('en-US', { year: 'numeric' })}`}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Social Profiles Section */}
            {personData.enrichment_data.data.profiles && personData.enrichment_data.data.profiles.length > 0 && (
              <div className="col-span-2 space-y-2">
                <h3 className="font-medium text-gray-700">Social Profiles</h3>
                <div className="flex flex-wrap gap-3">
                  {personData.enrichment_data.data.profiles.map((profile) => (
                    <a
                      key={profile.url}
                      href={profile.url.startsWith('http') ? profile.url : `https://${profile.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm text-blue-600 hover:underline"
                    >
                      {profile.network.charAt(0).toUpperCase() + profile.network.slice(1)}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Orders Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">Order History</h2>
        <OrdersTable data={personData.orders} />
      </div>
    </div>
  );
}
