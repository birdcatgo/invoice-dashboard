'use client';

import { useState } from 'react';
import { DashboardData } from '@/lib/types';
import NetworkTermsTable from '@/components/NetworkTermsTable';
import TotalDisplay from '@/components/TotalDisplay';
import PageHeader from '@/components/PageHeader';

interface Props {
  data: DashboardData;
}

export default function DashboardClient({ data }: Props) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const networkExposureTotal = data.networkTerms.reduce((sum, term) => sum + term.runningTotal, 0);
  const outstandingTotal = data.invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const toBeInvoicedTotal = data.toBeInvoiced.reduce((sum, inv) => sum + inv.amount, 0);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      window.location.reload();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader title="Dashboard" onRefresh={handleRefresh} />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
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

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-200 bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900">Current Network Exposure</h2>
          </div>
          <div className="p-6">
            <NetworkTermsTable networkTerms={data.networkTerms} />
          </div>
        </div>
      </div>
    </div>
  );
} 