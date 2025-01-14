'use client';

import Link from 'next/link';
import { DashboardData } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import Header from '@/components/Header';

interface Props {
  data: DashboardData;
}

export default function DashboardClient({ data }: Props) {
  const totalToBeInvoiced = data.toBeInvoiced.reduce((sum, inv) => sum + inv.amount, 0);
  const totalOutstanding = data.invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const totalPaid = data.paidInvoices.reduce((sum, inv) => sum + inv.amount, 0);

  const sortedNetworkTerms = [...data.networkTerms].sort((a, b) => b.runningTotal - a.runningTotal);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="px-6 mb-8">
        <Header showRefresh={true} />
      </div>
      
      {/* Summary Cards */}
      <div className="px-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/to-be-invoiced" 
            className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">To Be Invoiced</h2>
            <p className="text-3xl font-bold text-indigo-600">
              {formatCurrency(totalToBeInvoiced)}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {data.toBeInvoiced.length} items ready
            </p>
          </Link>

          <Link href="/outstanding-invoices"
            className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Outstanding</h2>
            <p className="text-3xl font-bold text-orange-600">
              {formatCurrency(totalOutstanding)}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {data.invoices.length} invoices outstanding
            </p>
          </Link>

          <Link href="/paid-invoices"
            className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Paid</h2>
            <p className="text-3xl font-bold text-green-600">
              {formatCurrency(totalPaid)}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {data.paidInvoices.length} invoices paid
            </p>
          </Link>
        </div>
      </div>

      {/* Network Terms Section */}
      <div className="px-6">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Network Terms & Current Exposure</h2>
          </div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Network</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pay Period</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Period Start</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Period End</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Running Total</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedNetworkTerms.map((network, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {network.network}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {network.payPeriod} days
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(network.periodStart)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(network.periodEnd)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(network.runningTotal)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 