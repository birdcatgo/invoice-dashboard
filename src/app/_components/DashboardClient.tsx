'use client';

import { DashboardData } from '@/lib/types';
import NetworkTermsTable from '@/components/NetworkTermsTable';
import TotalDisplay from '@/components/TotalDisplay';
import PageHeader from '@/components/PageHeader';

interface Props {
  data: DashboardData;
}

export default function DashboardClient({ data }: Props) {
  const handleRefresh = async () => {
    window.location.reload();
  };

  const networkExposureTotal = data.networkTerms.reduce((sum, term) => sum + term.runningTotal, 0);
  const outstandingTotal = data.invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const toBeInvoicedTotal = data.toBeInvoiced.reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto px-3 py-4">
        <PageHeader title="Dashboard" onRefresh={handleRefresh} />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <TotalDisplay 
            label="To Be Invoiced" 
            amount={toBeInvoicedTotal} 
          />
          <TotalDisplay 
            label="Outstanding Invoices" 
            amount={outstandingTotal} 
          />
          <TotalDisplay 
            label="Current Network Exposure" 
            amount={networkExposureTotal} 
          />
        </div>

        <div className="bg-white rounded shadow">
          <div className="px-3 py-2 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Current Network Exposure</h2>
          </div>
          <NetworkTermsTable networkTerms={data.networkTerms} />
        </div>
      </div>
    </div>
  );
} 