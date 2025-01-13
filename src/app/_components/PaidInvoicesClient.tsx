'use client';

import { DashboardData, Invoice } from '@/lib/types';
import InvoiceTable from '@/components/InvoiceTable';
import InvoicePageLayout from '@/components/InvoicePageLayout';
import { formatCurrency } from '@/lib/utils';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  data: DashboardData;
}

interface ApiResponse {
  success?: boolean;
  error?: string;
  details?: string;
}

export default function PaidInvoicesClient({ data }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [localInvoices, setLocalInvoices] = useState(data.paidInvoices);
  const router = useRouter();

  const totalPaid = localInvoices.reduce((sum, inv) => sum + (inv.amountPaid || inv.amount), 0);

  const handlePaymentDetailsUpdate = async (invoice: Invoice, field: 'datePaid' | 'amountPaid', value: string | number) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'updatePaymentDetails',
          invoice: {
            ...invoice,
            [field]: value
          }
        })
      });

      const result = await response.json() as ApiResponse;

      if (!response.ok) {
        throw new Error(result.details || result.error || 'Failed to update payment details');
      }

      if (result.success) {
        setLocalInvoices(current =>
          current.map(inv =>
            inv.network === invoice.network &&
            inv.amount === invoice.amount &&
            inv.dueDate === invoice.dueDate
              ? { ...inv, [field]: value }
              : inv
          )
        );
        router.refresh();
      }
    } catch (error) {
      console.error('Error updating payment details:', error);
      alert(error instanceof Error ? error.message : 'Failed to update payment details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUndoPaid = async (invoice: Invoice) => {
    if (!confirm('Are you sure you want to move this invoice back to outstanding?')) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'undoPaid',
          invoice
        })
      });

      const result = await response.json() as ApiResponse;

      if (!response.ok) {
        throw new Error(result.details || result.error || 'Failed to undo payment');
      }

      if (result.success) {
        setLocalInvoices(current =>
          current.filter(inv =>
            !(inv.network === invoice.network &&
              inv.amount === invoice.amount &&
              inv.dueDate === invoice.dueDate)
          )
        );
        router.refresh();
      }
    } catch (error) {
      console.error('Error undoing payment:', error);
      alert(error instanceof Error ? error.message : 'Failed to undo payment');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <InvoicePageLayout title="Paid Invoices">
      <div className="p-6">
        <div className="mb-6 bg-green-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold text-green-700 mb-2">Total Paid</h2>
          <p className="text-3xl font-bold text-green-600">
            {formatCurrency(totalPaid)}
          </p>
          <p className="text-sm text-green-500 mt-2">
            {localInvoices.length} invoices paid
          </p>
        </div>
        <InvoiceTable 
          invoices={localInvoices}
          isEditable={true}
          onDatePaidEdit={(invoice, date) => handlePaymentDetailsUpdate(invoice, 'datePaid', date)}
          onAmountPaidEdit={(invoice, amount) => handlePaymentDetailsUpdate(invoice, 'amountPaid', amount)}
          onAction={handleUndoPaid}
          actionLabel={isLoading ? "Processing..." : "Move to Outstanding"}
          actionClass="text-orange-600 hover:text-orange-900"
          showPaymentDetails={true}
          showDifference={true}
        />
      </div>
    </InvoicePageLayout>
  );
} 