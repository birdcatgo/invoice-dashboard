'use client';

import { DashboardData } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import NetworkTermsTable from '@/components/NetworkTermsTable';
import { useRouter } from 'next/navigation';

interface Props {
  data: DashboardData;
}

export default function DashboardClient({ data }: Props) {
  const router = useRouter();
  const handleRefresh = async () => router.refresh();

  const totalToBeInvoiced = data.toBeInvoiced.reduce((sum, inv) => sum + inv.amount, 0);
  const totalOutstanding = data.invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const totalPaid = data.paidInvoices.reduce((sum, inv) => sum + inv.amount, 0);
  const totalRunning = data.networkTerms.reduce((sum, term) => sum + term.runningTotal, 0);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Invoice Dashboard</h1>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
        >
          Refresh Data
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Link href="/to-be-invoiced" className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500">To Be Invoiced</h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">{formatCurrency(totalToBeInvoiced)}</p>
          <p className="text-sm text-gray-500 mt-1">{data.toBeInvoiced.length} invoices</p>
        </Link>

        <Link href="/outstanding-invoices" className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500">Outstanding</h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">{formatCurrency(totalOutstanding)}</p>
          <p className="text-sm text-gray-500 mt-1">{data.invoices.length} invoices</p>
        </Link>

        <Link href="/paid-invoices" className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500">Recently Paid</h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">{formatCurrency(totalPaid)}</p>
          <p className="text-sm text-gray-500 mt-1">{data.paidInvoices.length} invoices</p>
        </Link>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500">Running Total</h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">{formatCurrency(totalRunning)}</p>
          <p className="text-sm text-gray-500 mt-1">{data.networkTerms.length} networks</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Network Terms</h2>
        <NetworkTermsTable networkTerms={data.networkTerms} />
      </div>
    </div>
  );
} 