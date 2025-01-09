'use client';

import { useState } from 'react';
import { DashboardData, Invoice } from '@/lib/types';
import InvoiceTable from '@/components/InvoiceTable';
import InvoicePageLayout from '@/components/InvoicePageLayout';

interface Props {
  data: DashboardData;
}

export default function OutstandingInvoicesClient({ data }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const totalOutstanding = data.invoices.reduce((sum, inv) => sum + inv.amount, 0);

  const handleMarkAsPaid = async (invoice: Invoice) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'markAsPaid',
          invoice
        })
      });

      if (!response.ok) throw new Error('Failed to mark as paid');
      window.location.reload();
    } catch (error) {
      console.error('Error marking as paid:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <InvoicePageLayout title="Outstanding Invoices">
      <div className="p-6">
        <div className="mb-6 bg-orange-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold text-orange-700 mb-2">Total Outstanding</h2>
          <p className="text-3xl font-bold text-orange-600">
            ${totalOutstanding.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <InvoiceTable 
          invoices={data.invoices}
          onAction={handleMarkAsPaid}
          actionLabel={isLoading ? "Processing..." : "Mark as Paid"}
          actionClass="text-green-600 hover:text-green-900"
          showNotes={true}
        />
      </div>
    </InvoicePageLayout>
  );
} 