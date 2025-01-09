'use client';

import { DashboardData } from '@/lib/types';
import InvoiceTable from '@/components/InvoiceTable';
import InvoicePageLayout from '@/components/InvoicePageLayout';

interface Props {
  data: DashboardData;
}

export default function PaidInvoicesClient({ data }: Props) {
  const totalPaid = data.paidInvoices.reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <InvoicePageLayout title="Paid Invoices">
      <div className="p-6">
        <div className="mb-6 bg-green-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold text-green-700 mb-2">Total Paid</h2>
          <p className="text-3xl font-bold text-green-600">
            ${totalPaid.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <InvoiceTable 
          invoices={data.paidInvoices}
          showNotes={true}
        />
      </div>
    </InvoicePageLayout>
  );
} 