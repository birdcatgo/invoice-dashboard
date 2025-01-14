'use client';

import { Invoice } from '@/lib/types';
import { formatCurrency, formatDate, getInvoiceStatusColor, getInvoiceStatus } from '@/lib/utils';

interface Props {
  invoices: Invoice[];
  onAction?: (invoice: Invoice) => void;
  actionLabel?: string;
  actionClass?: string;
  showNotes?: boolean;
  showBasicInfo?: boolean;
  onNotesEdit?: (invoice: Invoice, notes: string) => void;
  isEditable?: boolean;
  onAmountChange?: (invoice: Invoice, amount: number) => void;
}

export default function ClientInvoiceTable({
  invoices,
  onAction,
  actionLabel = "Mark as Paid",
  actionClass = "text-green-600 hover:text-green-900",
  showNotes = false,
  showBasicInfo = false
}: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Network</th>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
            {!showBasicInfo && (
              <>
                {onAction && <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>}
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount Paid</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date Paid</th>
                {showNotes && <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Notes</th>}
              </>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {invoices.map((invoice, index) => (
            <tr key={index} className={new Date(invoice.dueDate) < new Date() ? 'bg-yellow-50' : ''}>
              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{invoice.network}</td>
              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{formatCurrency(invoice.amount)}</td>
              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{formatDate(invoice.dueDate)}</td>
              {!showBasicInfo && (
                <>
                  {onAction && (
                    <td className="px-3 py-2 whitespace-nowrap text-right text-sm">
                      <button onClick={() => onAction(invoice)} className={`font-medium ${actionClass}`}>
                        {actionLabel}
                      </button>
                    </td>
                  )}
                  <td className={`px-3 py-2 whitespace-nowrap text-sm ${getInvoiceStatusColor(invoice.dueDate)}`}>
                    {getInvoiceStatus(invoice.dueDate)}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm">
                    <input
                      type="number"
                      className="border rounded px-2 py-1 w-24"
                      defaultValue={invoice.amountPaid}
                    />
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm">
                    <input
                      type="date"
                      className="border rounded px-2 py-1"
                      defaultValue={invoice.datePaid}
                    />
                  </td>
                  {showNotes && (
                    <td className="px-3 py-2 whitespace-nowrap text-sm">
                      <input
                        type="text"
                        className="border rounded px-2 py-1 w-full"
                        defaultValue={invoice.notes}
                        placeholder="Add notes..."
                      />
                    </td>
                  )}
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 