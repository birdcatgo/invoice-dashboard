'use client';

import { useState } from 'react';
import { DashboardData, Invoice } from '@/lib/types';
import InvoiceTable from '@/components/InvoiceTable';
import InvoicePageLayout from '@/components/InvoicePageLayout';

interface Props {
  data: DashboardData;
}

export default function ToBeInvoicedClient({ data }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const handleMarkAsInvoiced = async (invoice: Invoice) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'markAsInvoiced',
          invoice
        })
      });

      if (!response.ok) throw new Error('Failed to mark as invoiced');
      window.location.reload();
    } catch (error) {
      console.error('Error marking as invoiced:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <InvoicePageLayout title="To Be Invoiced">
      <div className="p-6">
        <InvoiceTable 
          invoices={data.toBeInvoiced}
          onAction={handleMarkAsInvoiced}
          actionLabel={isLoading ? "Processing..." : "Mark as Invoiced"}
          actionClass="text-indigo-600 hover:text-indigo-900"
          showNotes={true}
        />
      </div>
    </InvoicePageLayout>
  );
} 