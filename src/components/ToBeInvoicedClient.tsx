'use client';

import { useState } from 'react';
import { DashboardData } from '@/lib/types';
import ClientInvoiceTable from './ClientInvoiceTable';

interface Props {
  data: DashboardData;
}

export default function ToBeInvoicedClient({ data }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const onMarkAsInvoiced = (invoice: any) => {
    setIsLoading(true);
    fetch('/api/invoices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'markAsInvoiced',
        invoice
      }),
    })
    .then(response => {
      if (!response.ok) throw new Error('Failed to mark as invoiced');
      window.location.reload();
    })
    .catch(error => {
      console.error('Error marking as invoiced:', error);
    })
    .finally(() => {
      setIsLoading(false);
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">To Be Invoiced</h1>
      <ClientInvoiceTable 
        invoices={data.toBeInvoiced}
        onAction={onMarkAsInvoiced}
        actionLabel={isLoading ? "Processing..." : "Mark as Invoiced"}
        actionClass="text-indigo-600 hover:text-indigo-900"
      />
    </div>
  );
} 