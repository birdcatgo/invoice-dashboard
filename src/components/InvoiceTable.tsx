'use client';

import { Invoice } from '@/lib/types';
import { formatCurrency, formatDate, getInvoiceStatusColor } from '@/lib/utils';

interface Props {
  invoices: Invoice[];
  onAction?: (invoice: Invoice) => void;
  actionLabel?: string;
  actionClass?: string;
  showNotes?: boolean;
  isEditable?: boolean;
  onNotesEdit?: (invoice: Invoice, notes: string) => void;
  onAmountChange?: (invoice: Invoice, amount: number) => void;
}

export default function InvoiceTable({
  invoices,
  onAction,
  actionLabel = "Mark as Paid",
  actionClass = "text-green-600 hover:text-green-900",
  showNotes = false,
  isEditable = false,
  onNotesEdit,
  onAmountChange
}: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Network</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            {showNotes && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
            )}
            {onAction && (
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {invoices.map((invoice, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {invoice.network}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {isEditable && onAmountChange ? (
                  <input
                    type="number"
                    className="border rounded px-2 py-1 w-32"
                    defaultValue={invoice.amount}
                    onChange={(e) => onAmountChange(invoice, Number(e.target.value))}
                  />
                ) : (
                  formatCurrency(invoice.amount)
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(invoice.dueDate)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getInvoiceStatusColor(invoice.dueDate)}`}>
                  {new Date(invoice.dueDate) < new Date() ? 'Overdue' : 'Due'}
                </span>
              </td>
              {showNotes && (
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {isEditable && onNotesEdit ? (
                    <input
                      type="text"
                      className="border rounded px-2 py-1 w-full"
                      defaultValue={invoice.notes}
                      onChange={(e) => onNotesEdit(invoice, e.target.value)}
                      placeholder="Add notes..."
                    />
                  ) : (
                    invoice.notes || '-'
                  )}
                </td>
              )}
              {onAction && (
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onAction(invoice)}
                    className={`${actionClass} font-medium hover:underline focus:outline-none`}
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
  );
}