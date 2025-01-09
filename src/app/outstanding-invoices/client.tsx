'use client';

import { useState } from 'react';
import { DashboardData, Invoice } from '@/lib/types';
import ClientInvoiceTable from '@/components/ClientInvoiceTable';
import InvoicePageLayout from '@/components/InvoicePageLayout';

interface Props {
  data: DashboardData;
}

export default function OutstandingClient({ data }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [invoices, setInvoices] = useState(data.invoices);

  const handleNotesEdit = (invoice: Invoice, notes: string) => {
    setInvoices(current => 
      current.map(inv => 
        inv === invoice ? { ...inv, notes } : inv
      )
    );
  };

  const onMarkAsPaid = (invoice: Invoice, amountPaid?: number, datePaid?: string) => {
    setIsLoading(true);
    fetch('/api/invoices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'markAsPaid',
        invoice,
        amountPaid,
        datePaid
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
    <InvoicePageLayout title="Outstanding Invoices">
      <ClientInvoiceTable 
        invoices={invoices}
        onAction={onMarkAsPaid}
        actionLabel={isLoading ? "Processing..." : "Mark as Paid"}
        actionClass="text-green-600 hover:text-green-900"
        showStatus={true}
        showNotes={true}
        onNotesEdit={handleNotesEdit}
        showPaymentDetails={true}
      />
    </InvoicePageLayout>
  );
} 