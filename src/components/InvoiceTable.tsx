'use client';

import { Invoice } from '@/lib/types';
import { formatCurrency, formatDate, getInvoiceStatusColor } from '@/lib/utils';

interface Props {
  invoices: Invoice[];
  onAction?: (invoice: Invoice) => void;
  onDelete?: (invoice: Invoice) => void;
  actionLabel?: string;
  actionClass?: string;
  showNotes?: boolean;
  isEditable?: boolean;
  showPaymentDetails?: boolean;
  showDifference?: boolean;
  onNotesEdit?: (invoice: Invoice, notes: string) => void;
  onDatePaidEdit?: (invoice: Invoice, date: string) => void;
  onAmountPaidEdit?: (invoice: Invoice, amount: number) => void;
}

export default function InvoiceTable({
  invoices,
  onAction,
  onDelete,
  actionLabel = "Mark as Paid",
  actionClass = "text-green-600 hover:text-green-900",
  showNotes = false,
  isEditable = false,
  showPaymentDetails = false,
  showDifference = false,
  onNotesEdit,
  onDatePaidEdit,
  onAmountPaidEdit
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
            {showPaymentDetails && (
              <>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Paid</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount Paid</th>
                {showDifference && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Difference</th>
                )}
              </>
            )}
            {(onAction || onDelete) && (
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {invoices.map((invoice, index) => {
            const difference = invoice.amountPaid 
              ? invoice.amountPaid - invoice.amount 
              : 0;
            
            return (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {invoice.network}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(invoice.amount)}
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
                {showPaymentDetails && (
                  <>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {isEditable && onDatePaidEdit ? (
                        <input
                          type="date"
                          className="border rounded px-2 py-1"
                          defaultValue={invoice.datePaid}
                          onChange={(e) => onDatePaidEdit(invoice, e.target.value)}
                        />
                      ) : (
                        invoice.datePaid ? formatDate(invoice.datePaid) : '-'
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {isEditable && onAmountPaidEdit ? (
                        <input
                          type="number"
                          step="0.01"
                          className="border rounded px-2 py-1 w-32"
                          defaultValue={invoice.amountPaid}
                          onChange={(e) => onAmountPaidEdit(invoice, Number(e.target.value))}
                        />
                      ) : (
                        invoice.amountPaid ? formatCurrency(invoice.amountPaid) : '-'
                      )}
                    </td>
                    {showDifference && (
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                        difference > 0 ? 'text-green-600' : difference < 0 ? 'text-red-600' : 'text-gray-500'
                      }`}>
                        {difference !== 0 ? formatCurrency(difference) : '-'}
                      </td>
                    )}
                  </>
                )}
                {(onAction || onDelete) && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-3">
                      {onAction && (
                        <button
                          onClick={() => onAction(invoice)}
                          className={`${actionClass} font-medium hover:underline focus:outline-none`}
                        >
                          {actionLabel}
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this invoice?')) {
                              onDelete(invoice);
                            }
                          }}
                          className="text-red-600 hover:text-red-900 font-medium hover:underline focus:outline-none"
                        >
                          Delete
                        </button>
                      )}
                    </div>
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