'use client'

import { useState, useCallback } from 'react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Invoice } from '@/lib/types';

type SortField = 'network' | 'amount' | 'dueDate';
type SortDirection = 'asc' | 'desc';

interface InvoiceTableProps {
  invoices: Invoice[];
  onAction?: (invoice: Invoice) => void;
  actionLabel?: string;
  actionClass?: string;
}

export default function InvoiceTable({ 
  invoices, 
  onAction, 
  actionLabel,
  actionClass = "text-indigo-600 hover:text-indigo-900"
}: InvoiceTableProps) {
  const [sortField, setSortField] = useState<SortField>('dueDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSort = useCallback((field: SortField) => {
    setSortDirection(current => 
      sortField === field ? (current === 'asc' ? 'desc' : 'asc') : 'asc'
    );
    setSortField(field);
  }, [sortField]);

  const filteredAndSortedInvoices = [...invoices]
    .filter(invoice => 
      invoice.network.toLowerCase().includes(searchTerm.toLowerCase()) ||
      formatDate(invoice.dueDate).includes(searchTerm)
    )
    .sort((a, b) => {
      if (sortField === 'amount') {
        return sortDirection === 'asc' ? a.amount - b.amount : b.amount - a.amount;
      }
      if (sortField === 'dueDate') {
        return sortDirection === 'asc' 
          ? new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
          : new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
      }
      return sortDirection === 'asc'
        ? a[sortField].localeCompare(b[sortField])
        : b[sortField].localeCompare(a[sortField]);
    });

  const totalAmount = filteredAndSortedInvoices.reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="px-4 py-2 border rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="text-lg font-semibold">
          Total: {formatCurrency(totalAmount)}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th 
                className="px-6 py-3 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('network')}
              >
                Network
                {sortField === 'network' && (
                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                className="px-6 py-3 text-right text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('amount')}
              >
                Amount
                {sortField === 'amount' && (
                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                className="px-6 py-3 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('dueDate')}
              >
                Due Date
                {sortField === 'dueDate' && (
                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              {onAction && (
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredAndSortedInvoices.map((invoice, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">{invoice.network}</td>
                <td className="px-6 py-4 text-sm text-gray-900 text-right">
                  {formatCurrency(invoice.amount)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{formatDate(invoice.dueDate)}</td>
                {onAction && (
                  <td className="px-6 py-4 text-sm text-right">
                    <button
                      onClick={() => onAction(invoice)}
                      className={actionClass}
                    >
                      {actionLabel}
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}