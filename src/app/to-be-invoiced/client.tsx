'use client';

import { useState } from 'react';
import { DashboardData, Invoice } from '@/lib/types';
import ClientInvoiceTable from '@/components/ClientInvoiceTable';
import InvoicePageLayout from '@/components/InvoicePageLayout';

interface Props {
  data: DashboardData;
}

export default function ToBeInvoicedClient({ data }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [invoices, setInvoices] = useState(data.toBeInvoiced);

  const handleAmountChange = (invoice: Invoice, amount: number) => {
    setInvoices(current => 
      current.map(inv => 
        inv === invoice ? { ...inv, amount } : inv
      )
    );
  };

  const handleNotesEdit = (invoice: Invoice, notes: string) => {
    setInvoices(current => 
      current.map(inv => 
        inv === invoice ? { ...inv, notes } : inv
      )
    );
  };

  const onMarkAsInvoiced = (invoice: Invoice) => {
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
    <InvoicePageLayout title="To Be Invoiced">
      <ClientInvoiceTable 
        invoices={invoices}
        onAction={onMarkAsInvoiced}
        actionLabel={isLoading ? "Processing..." : "Mark as Invoiced"}
        actionClass="text-indigo-600 hover:text-indigo-900"
        onNotesEdit={handleNotesEdit}
        showNotes={true}
        isEditable={true}
        onAmountChange={handleAmountChange}
      />
    </InvoicePageLayout>
  );
} 