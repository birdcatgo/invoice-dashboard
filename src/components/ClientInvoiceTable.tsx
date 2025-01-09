'use client';

import { useState } from 'react';
import { Invoice } from '@/lib/types';
import { formatCurrency, getInvoiceStatusColor, isOverdue } from '@/lib/utils';

interface Props {
  invoices: Invoice[];
  onAction?: (invoice: Invoice, amountPaid?: number, datePaid?: string) => void;
  actionLabel?: string;
  actionClass?: string;
  showStatus?: boolean;
  showNotes?: boolean;
  onNotesEdit?: (invoice: Invoice, notes: string) => void;
  showPaymentDetails?: boolean;
  isEditable?: boolean;
  onAmountChange?: (invoice: Invoice, amount: number) => void;
}

function getRowBackgroundColor(dueDate: string): string {
  return isOverdue(dueDate) 
    ? 'bg-yellow-50 hover:bg-yellow-100'
    : 'hover:bg-gray-50';
}

export default function ClientInvoiceTable({ 
  invoices, 
  onAction, 
  actionLabel,
  actionClass = "text-indigo-600 hover:text-indigo-900",
  showStatus = false,
  showNotes = false,
  onNotesEdit,
  showPaymentDetails = false,
  isEditable = false,
  onAmountChange
}: Props) {
  const [sortField, setSortField] = useState<keyof Invoice>('dueDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [searchTerm, setSearchTerm] = useState('');

  const [paymentDetails, setPaymentDetails] = useState<Record<string, { amount: string; date: string }>>({});

  const handleSort = (field: keyof Invoice) => {
    setSortDirection(current => 
      sortField === field ? (current === 'asc' ? 'desc' : 'asc') : 'asc'
    );
    setSortField(field);
  };

  const filteredAndSortedInvoices = [...invoices]
    .filter(invoice => 
      invoice.network.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.dueDate.includes(searchTerm)
    )
    .sort((a, b) => {
      if (sortField === 'amount') {
        return sortDirection === 'asc' ? a.amount - b.amount : b.amount - a.amount;
      }
      if (sortField === 'dueDate') {
        const dateA = new Date(a.dueDate.split('/').reverse().join('-'));
        const dateB = new Date(b.dueDate.split('/').reverse().join('-'));
        return sortDirection === 'asc' 
          ? dateA.getTime() - dateB.getTime()
          : dateB.getTime() - dateA.getTime();
      }
      const aValue = String(a[sortField] || '');
      const bValue = String(b[sortField] || '');
      return sortDirection === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });

  const totalAmount = filteredAndSortedInvoices.reduce((sum, inv) => sum + inv.amount, 0);

  const handlePaymentSubmit = (invoice: Invoice) => {
    const details = paymentDetails[invoice.network] || { amount: '', date: '' };
    const amountPaid = parseFloat(details.amount) || invoice.amount;
    const datePaid = details.date || new Date().toISOString().split('T')[0];
    
    if (onAction) {
      onAction(invoice, amountPaid, datePaid);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Search..."
          className="px-4 py-2 border rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="text-lg font-semibold">
          Total: {formatCurrency(totalAmount)}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th 
                onClick={() => handleSort('network')}
                className="px-6 py-3 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
              >
                Network {sortField === 'network' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                onClick={() => handleSort('amount')}
                className="px-6 py-3 text-right text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
              >
                Amount {sortField === 'amount' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                onClick={() => handleSort('dueDate')}
                className="px-6 py-3 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
              >
                Due Date {sortField === 'dueDate' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              {showStatus && (
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
              )}
              {showNotes && (
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Notes</th>
              )}
              {showPaymentDetails && (
                <>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Amount Paid</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date Paid</th>
                </>
              )}
              {onAction && (
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredAndSortedInvoices.map((invoice, index) => (
              <tr key={index} className={getRowBackgroundColor(invoice.dueDate)}>
                <td className="px-6 py-4 text-sm text-gray-900">{invoice.network}</td>
                <td className="px-6 py-4 text-sm text-gray-900 text-right">
                  {isEditable ? (
                    <input
                      type="number"
                      value={invoice.amount}
                      onChange={(e) => onAmountChange?.(invoice, parseFloat(e.target.value) || 0)}
                      className="w-24 px-2 py-1 text-right border rounded"
                      step="0.01"
                    />
                  ) : (
                    formatCurrency(invoice.amount)
                  )}
                </td>
                <td className={`px-6 py-4 text-sm ${getInvoiceStatusColor(invoice.dueDate)}`}>
                  {invoice.dueDate}
                </td>
                {showStatus && (
                  <td className={`px-6 py-4 text-sm ${getInvoiceStatusColor(invoice.dueDate)}`}>
                    {isOverdue(invoice.dueDate) ? 'Overdue' : 'Due'}
                  </td>
                )}
                {showNotes && (
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <input
                      type="text"
                      value={invoice.notes || ''}
                      onChange={(e) => {
                        if (onNotesEdit) {
                          onNotesEdit(invoice, e.target.value);
                        }
                      }}
                      className="w-full px-2 py-1 border rounded"
                      placeholder="Add notes..."
                    />
                  </td>
                )}
                {showPaymentDetails && (
                  <>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <input
                        type="number"
                        step="0.01"
                        placeholder={formatCurrency(invoice.amount)}
                        value={paymentDetails[invoice.network]?.amount || ''}
                        onChange={(e) => setPaymentDetails(prev => ({
                          ...prev,
                          [invoice.network]: { ...prev[invoice.network], amount: e.target.value }
                        }))}
                        className="w-32 px-2 py-1 border rounded"
                      />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <input
                        type="date"
                        value={paymentDetails[invoice.network]?.date || ''}
                        onChange={(e) => setPaymentDetails(prev => ({
                          ...prev,
                          [invoice.network]: { ...prev[invoice.network], date: e.target.value }
                        }))}
                        className="px-2 py-1 border rounded"
                      />
                    </td>
                  </>
                )}
                {onAction && (
                  <td className="px-6 py-4 text-sm text-right">
                    <button
                      onClick={() => showPaymentDetails ? handlePaymentSubmit(invoice) : onAction(invoice)}
                      className={`${actionClass} ${isOverdue(invoice.dueDate) ? 'font-medium' : ''}`}
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