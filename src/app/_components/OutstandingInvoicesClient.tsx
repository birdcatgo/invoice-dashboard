'use client';

import { useState } from 'react';
import { DashboardData, Invoice } from '@/lib/types';
import ClientInvoiceTable from '@/components/ClientInvoiceTable';
import InvoicePageLayout from '@/components/InvoicePageLayout';
import TotalDisplay from '@/components/TotalDisplay';

interface Props {
  data: DashboardData;
}

export default function OutstandingInvoicesClient({ data }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const outstandingTotal = data.invoices.reduce((sum, inv) => sum + inv.amount, 0);

  const handleMarkAsPaid = async (invoice: Invoice) => {
    if (!invoice.amountPaid || !invoice.datePaid) {
      alert('Please fill in both Amount Paid and Date Paid before marking as paid');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'markAsPaid',
          invoice: {
            ...invoice,
            status: 'paid'
          }
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
      <div className="space-y-8">
        <div className="max-w-sm">
          <TotalDisplay 
            label="Total Outstanding" 
            amount={outstandingTotal} 
          />
        </div>
        <ClientInvoiceTable 
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