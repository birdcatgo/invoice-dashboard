'use client';

import { NetworkTerms } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/utils';

interface Props {
  networkTerms: NetworkTerms[];
}

function formatPayPeriod(days: number): string {
  switch (days) {
    case 7: return 'Weekly (7)';
    case 15: return 'Bi-Monthly (15)';
    case 30: return 'Monthly (30)';
    default: return `${days} days`;
  }
}

function formatNetTerms(days: number): string {
  return `Net ${days}`;
}

export default function NetworkTermsTable({ networkTerms }: Props) {
  // Sort by running total in descending order
  const sortedNetworks = [...networkTerms].sort((a, b) => b.runningTotal - a.runningTotal);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Network</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Offer</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pay Period</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Net Terms</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Period Start</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Period End</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice Due</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Running Total</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedNetworks.map((term, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{term.network}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{term.offer}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatPayPeriod(term.payPeriod)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatNetTerms(term.netTerms)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(term.periodStart)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(term.periodEnd)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(term.invoiceDue)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(term.runningTotal)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 