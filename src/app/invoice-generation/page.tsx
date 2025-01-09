import { getPSTDateRange } from '@/lib/utils';

export default function InvoiceGenerationPage() {
  const { startDate, endDate, displayRange } = getPSTDateRange(new Date('2024-01-06'));
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Invoice Generation</h1>
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-2">
          Period: {displayRange} (PST)
        </h2>
        
        {/* Add your networks table/list here */}
        <table className="w-full mt-4">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Network</th>
              <th className="text-left py-2">Payment Terms</th>
              <th className="text-left py-2">Traffic Status</th>
              <th className="text-left py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Add your network rows here */}
          </tbody>
        </table>
      </div>
    </div>
  );
} 