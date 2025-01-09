'use client';

import { DashboardData } from '@/lib/types';
import ClientInvoiceTable from '@/components/ClientInvoiceTable';
import InvoicePageLayout from '@/components/InvoicePageLayout';

interface Props {
  data: DashboardData;
}

export default function PaidInvoicesClient({ data }: Props) {
  return (
    <InvoicePageLayout title="Recently Paid Invoices">
      <ClientInvoiceTable 
        invoices={data.paidInvoices}
        showNotes={true}
      />
    </InvoicePageLayout>
  );
} 