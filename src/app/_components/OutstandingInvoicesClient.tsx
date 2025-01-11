'use client';

import { useState } from 'react';
import { DashboardData, Invoice } from '@/lib/types';
import InvoiceTable from '@/components/InvoiceTable';
import InvoicePageLayout from '@/components/InvoicePageLayout';
import { formatCurrency } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import PaymentModal from '@/components/PaymentModal';

interface Props {
  data: DashboardData;
}

interface ApiResponse {
  success?: boolean;
  error?: string;
  details?: string;
}

export default function OutstandingInvoicesClient({ data }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [localInvoices, setLocalInvoices] = useState(data.invoices);
  const [lastRemovedInvoice, setLastRemovedInvoice] = useState<Invoice | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const router = useRouter();

  const overdueInvoices = localInvoices.filter(invoice => 
    new Date(invoice.dueDate) < new Date()
  );

  const totalOutstanding = localInvoices.reduce((sum, inv) => sum + inv.amount, 0);
  const totalOverdue = overdueInvoices.reduce((sum, inv) => sum + inv.amount, 0);

  const handleMarkAsPaid = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
  };

  const handlePaymentConfirm = async (datePaid: string, amountPaid: number) => {
    if (!selectedInvoice) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'markAsPaid',
          invoice: {
            ...selectedInvoice,
            datePaid,
            amountPaid,
            status: 'paid'
          }
        })
      });

      const result = await response.json() as ApiResponse;

      if (!response.ok) {
        throw new Error(result.details || result.error || 'Failed to mark as paid');
      }

      if (result.success) {
        setLastRemovedInvoice(selectedInvoice);
        setLocalInvoices(current => 
          current.filter(inv => 
            !(inv.network === selectedInvoice.network && 
              inv.amount === selectedInvoice.amount && 
              inv.dueDate === selectedInvoice.dueDate)
          )
        );
        setSelectedInvoice(null);
      } else {
        throw new Error('Failed to update invoice status');
      }
    } catch (error) {
      console.error('Error marking as paid:', error);
      alert(error instanceof Error ? error.message : 'Failed to mark as paid');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUndo = async () => {
    if (!lastRemovedInvoice) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'undoPaid',
          invoice: lastRemovedInvoice
        })
      });

      const result = await response.json() as ApiResponse;

      if (!response.ok) {
        throw new Error(result.details || result.error || 'Failed to undo');
      }

      if (result.success) {
        // Add the invoice back to local state
        setLocalInvoices(current => [...current, lastRemovedInvoice]);
        setLastRemovedInvoice(null);
        router.refresh();
      } else {
        throw new Error('Failed to undo action');
      }
    } catch (error) {
      console.error('Error undoing action:', error);
      alert(error instanceof Error ? error.message : 'Failed to undo');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <InvoicePageLayout title="Outstanding Invoices">
      <div className="p-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Total Outstanding Card */}
          <div className="bg-orange-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-orange-700 mb-2">Total Outstanding</h2>
            <p className="text-3xl font-bold text-orange-600">
              {formatCurrency(totalOutstanding)}
            </p>
            <p className="text-sm text-orange-500 mt-2">
              {data.invoices.length} invoices outstanding
            </p>
          </div>

          {/* Overdue Card */}
          <div className="bg-red-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-red-700 mb-2">Total Overdue</h2>
            <p className="text-3xl font-bold text-red-600">
              {formatCurrency(totalOverdue)}
            </p>
            <p className="text-sm text-red-500 mt-2">
              {overdueInvoices.length} invoices overdue
            </p>
          </div>
        </div>

        {/* Undo Button */}
        {lastRemovedInvoice && (
          <div className="mb-4 flex items-center justify-between bg-blue-50 p-4 rounded-lg">
            <span className="text-blue-700">
              Marked {lastRemovedInvoice.network} ({formatCurrency(lastRemovedInvoice.amount)}) as paid
            </span>
            <button
              onClick={handleUndo}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-blue-700 hover:text-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isLoading ? "Processing..." : "Undo"}
            </button>
          </div>
        )}

        {/* All Outstanding Invoices Table */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Outstanding Invoices</h2>
          <InvoiceTable 
            invoices={localInvoices}
            onAction={handleMarkAsPaid}
            actionLabel={isLoading ? "Processing..." : "Mark as Paid"}
            actionClass="text-green-600 hover:text-green-900"
          />
        </div>
      </div>

      <PaymentModal
        invoice={selectedInvoice!}
        isOpen={!!selectedInvoice}
        isLoading={isLoading}
        onClose={() => setSelectedInvoice(null)}
        onConfirm={handlePaymentConfirm}
      />
    </InvoicePageLayout>
  );
} 