'use client';

import { useState } from 'react';
import { DashboardData } from '@/lib/types';
import ClientInvoiceTable from './ClientInvoiceTable';

interface Props {
  data: DashboardData;
}

export default function PaidInvoicesClient({ data }: Props) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Paid Invoices</h1>
      <ClientInvoiceTable 
        invoices={data.paidInvoices}
      />
    </div>
  );
} 