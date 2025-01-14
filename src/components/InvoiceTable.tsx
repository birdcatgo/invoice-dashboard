'use client';

import { Invoice } from '@/lib/types';
import { formatCurrency, formatDate, getInvoiceStatusColor } from '@/lib/utils';

interface Props {
  invoices: Invoice[];
  onAction?: (invoice: Invoice) => void;
  actionLabel?: string;
  actionClass?: string;
  showPaymentDetails?: boolean;
  showDifference?: boolean;
  onDatePaidEdit?: (invoice: Invoice, date: string) => void;
  onAmountPaidEdit?: (invoice: Invoice, amount: number) => void;
}

export default function InvoiceTable({ 
  invoices, 
  onAction, 
  actionLabel = "Mark as Paid",
  actionClass = "text-green-600 hover:text-green-900",
  showPaymentDetails = false,
  showDifference = false,
  onDatePaidEdit,
  onAmountPaidEdit
}: Props) {
  const handleDateEdit = (invoice: Invoice, date: string) => {
    onDatePaidEdit?.(invoice, date);
  };

  const handleAmountEdit = (invoice: Invoice, amount: string) => {
    onAmountPaidEdit?.(invoice, parseFloat(amount));
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Network</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
            {showDifference && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paid Amount</th>
            )}
            {showDifference && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Remaining</th>
            )}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            {showPaymentDetails && (
              <>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date Paid</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount Paid</th>
              </>
            )}
            {onAction && (
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
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
                {formatCurrency(invoice.amount)}
              </td>
              {showDifference && (
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(invoice.amountPaid || 0)}
                </td>
              )}
              {showDifference && (
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(invoice.amount - (invoice.amountPaid || 0))}
                </td>
              )}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(invoice.dueDate)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getInvoiceStatusColor(invoice.dueDate)}`}>
                  {new Date(invoice.dueDate) < new Date() ? 'Overdue' : 'Due'}
                </span>
              </td>
              {showPaymentDetails && (
                <>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {invoice.datePaid ? formatDate(invoice.datePaid) : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {invoice.amountPaid ? formatCurrency(invoice.amountPaid) : '-'}
                  </td>
                </>
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