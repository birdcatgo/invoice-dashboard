'use client';

import { useState } from 'react';
import { NetworkTerms } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

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
  const [sortField, setSortField] = useState<keyof NetworkTerms>('network');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const sortedTerms = [...networkTerms].sort((a, b) => {
    if (sortField === 'runningTotal' || sortField === 'payPeriod' || sortField === 'netTerms') {
      const aValue = Number(a[sortField]) || 0;
      const bValue = Number(b[sortField]) || 0;
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    return sortDirection === 'asc'
      ? String(a[sortField] || '').localeCompare(String(b[sortField] || ''))
      : String(b[sortField] || '').localeCompare(String(a[sortField] || ''));
  });

  const handleSort = (field: keyof NetworkTerms) => {
    setSortDirection(current => 
      sortField === field ? (current === 'asc' ? 'desc' : 'asc') : 'asc'
    );
    setSortField(field);
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              {[
                ['network', 'Network'],
                ['offer', 'Offer'],
                ['payPeriod', 'Pay Period'],
                ['netTerms', 'Net Terms'],
                ['periodStart', 'Pay Period Start'],
                ['periodEnd', 'Pay Period End'],
                ['invoiceDue', 'Invoice Due'],
                ['runningTotal', 'Running Total']
              ].map(([key, label]) => (
                <th 
                  key={key}
                  onClick={() => handleSort(key as keyof NetworkTerms)}
                  className="px-6 py-3 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                >
                  {label}
                  {sortField === key && (
                    <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedTerms.map((term, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">{term.network}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{term.offer}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{formatPayPeriod(Number(term.payPeriod))}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{formatNetTerms(term.netTerms)}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{term.periodStart}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{term.periodEnd}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{term.invoiceDue}</td>
                <td className="px-6 py-4 text-sm text-gray-900 text-right">
                  {formatCurrency(term.runningTotal)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 