'use client';

import { useState } from 'react';
import { Invoice } from '@/lib/types';
import { formatCurrency, formatDate, getInvoiceStatusColor } from '@/lib/utils';

interface Props {
  invoices: Invoice[];
  onAction?: (invoice: Invoice) => void;
  actionLabel?: string;
  actionClass?: string;
}

export default function InvoiceTable({
  invoices,
  onAction,
  actionLabel = "Mark as Paid",
  actionClass = "text-green-600 hover:text-green-900",
}: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<'notes' | 'datePaid' | 'amountPaid' | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleEdit = (invoice: Invoice, field: 'notes' | 'datePaid' | 'amountPaid') => {
    setEditingId(invoice.network);
    setEditingField(field);
    setEditValue(invoice[field]?.toString() || '');
  };

  const handleSave = async (invoice: Invoice) => {
    if (!editingField) return;

    try {
      const updatedInvoice = {
        ...invoice,
        [editingField]: editValue
      };

      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update',
          field: editingField,
          invoice: updatedInvoice
        })
      });

      if (!response.ok) throw new Error('Failed to update');
      window.location.reload();
    } catch (error) {
      console.error('Error updating:', error);
    }

    setEditingId(null);
    setEditingField(null);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Network</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date Paid</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount Paid</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Notes</th>
            {onAction && <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice, index) => {
            const statusColor = getInvoiceStatusColor(invoice.dueDate);
            const rowClass = statusColor.replace('text-', 'bg-').replace('-600', '-50');

            return (
              <tr key={index} className={rowClass}>
                <td className="px-6 py-4 text-sm text-gray-900">{invoice.network}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{formatCurrency(invoice.amount)}</td>
                <td className={`px-6 py-4 text-sm ${statusColor}`}>{formatDate(invoice.dueDate)}</td>
                <td className={`px-6 py-4 text-sm ${statusColor}`}>
                  {invoice.status || (new Date(invoice.dueDate) < new Date() ? 'Overdue' : 'Not Due')}
                </td>
                <td className="px-6 py-4 text-sm">
                  {editingId === invoice.network && editingField === 'datePaid' ? (
                    <input
                      type="date"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={() => handleSave(invoice)}
                      className="border rounded px-2 py-1"
                      autoFocus
                    />
                  ) : (
                    <div onClick={() => handleEdit(invoice, 'datePaid')} className="cursor-pointer hover:text-blue-600">
                      {invoice.datePaid ? formatDate(invoice.datePaid) : '-'}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-sm">
                  {editingId === invoice.network && editingField === 'amountPaid' ? (
                    <input
                      type="number"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={() => handleSave(invoice)}
                      className="border rounded px-2 py-1"
                      autoFocus
                    />
                  ) : (
                    <div onClick={() => handleEdit(invoice, 'amountPaid')} className="cursor-pointer hover:text-blue-600">
                      {invoice.amountPaid ? formatCurrency(invoice.amountPaid) : '-'}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-sm">
                  {editingId === invoice.network && editingField === 'notes' ? (
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={() => handleSave(invoice)}
                      className="border rounded px-2 py-1"
                      autoFocus
                    />
                  ) : (
                    <div onClick={() => handleEdit(invoice, 'notes')} className="cursor-pointer hover:text-blue-600">
                      {invoice.notes || '-'}
                    </div>
                  )}
                </td>
                {onAction && (
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => onAction(invoice)} className={`text-sm font-medium ${actionClass}`}>
                      {actionLabel}
                    </button>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}