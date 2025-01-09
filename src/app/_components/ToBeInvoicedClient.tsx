'use client';

import { DashboardData } from '@/lib/types';
import ClientInvoiceTable from '@/components/ClientInvoiceTable';
import InvoicePageLayout from '@/components/InvoicePageLayout';
import TotalDisplay from '@/components/TotalDisplay';

interface Props {
  data: DashboardData;
}

export default function ToBeInvoicedClient({ data }: Props) {
  const toBeInvoicedTotal = data.toBeInvoiced.reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <InvoicePageLayout title="To Be Invoiced">
      <div className="space-y-8">
        <div className="max-w-sm">
          <TotalDisplay 
            label="Total To Be Invoiced" 
            amount={toBeInvoicedTotal} 
          />
        </div>
        <ClientInvoiceTable 
          invoices={data.toBeInvoiced}
          showBasicInfo={true}
        />
      </div>
    </InvoicePageLayout>
  );
} 