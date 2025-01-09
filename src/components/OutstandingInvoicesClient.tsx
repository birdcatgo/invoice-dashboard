'use client';

import { useState } from 'react';
import { DashboardData } from '@/lib/types';
import ClientInvoiceTable from './ClientInvoiceTable';

interface Props {
  data: DashboardData;
}

export default function OutstandingInvoicesClient({ data }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const onMarkAsPaid = (invoice: any) => {
    setIsLoading(true);
    fetch('/api/invoices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'markAsPaid',
        invoice
      }),
    })
    .then(response => {
      if (!response.ok) throw new Error('Failed to mark as paid');
      window.location.reload();
    })
    .catch(error => {
      console.error('Error marking as paid:', error);
    })
    .finally(() => {
      setIsLoading(false);
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Outstanding Invoices</h1>
      <ClientInvoiceTable 
        invoices={data.invoices}
        onAction={onMarkAsPaid}
        actionLabel={isLoading ? "Processing..." : "Mark as Paid"}
        actionClass="text-green-600 hover:text-green-900"
        showStatus={true}
      />
    </div>
  );
} 