'use client';

import { DashboardData } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
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
              {data.toBeInvoiced.length} invoices pending
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

      {/* Title and Network Terms Section */}
      <div className="px-6 mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Convert 2 Freedom Accounts Receivable</h1>
      </div>

      {/* Network Terms Table */}
      <div className="bg-white shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Network</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Offer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pay Period</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Net Terms</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Running Total</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedNetworkTerms.map((term, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{term.network}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{term.offer}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{term.payPeriod} days</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{term.netTerms} days</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                    {formatCurrency(term.runningTotal)}
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