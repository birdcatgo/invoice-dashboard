'use client';

import { useState } from 'react';
import { DashboardData, Invoice } from '@/lib/types';
import InvoiceTable from '@/components/InvoiceTable';
import InvoicePageLayout from '@/components/InvoicePageLayout';
import PaymentModal from '@/components/PaymentModal';

interface Props {
  data: DashboardData;
}

type SortField = 'network' | 'amount' | 'dueDate' | 'status';
type SortDirection = 'asc' | 'desc';

interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

export default function OutstandingInvoicesClient({ data }: Props) {
  console.log('OutstandingInvoicesClient data:', data);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [localInvoices, setLocalInvoices] = useState(data.invoices);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: 'network',
    direction: 'asc'
  });

  const handleSort = (field: SortField) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Get status of invoice (overdue or pending)
  const getInvoiceStatus = (invoice: Invoice): string => {
    return new Date(invoice.dueDate) < new Date() ? 'Overdue' : 'Pending';
  };

  // Sort invoices based on current sort config
  const sortedInvoices = [...localInvoices].sort((a, b) => {
    const direction = sortConfig.direction === 'asc' ? 1 : -1;

    switch (sortConfig.field) {
      case 'network':
        return a.network.localeCompare(b.network) * direction;
      case 'amount':
        return (a.amount - b.amount) * direction;
      case 'dueDate':
        return (new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()) * direction;
      case 'status':
        return getInvoiceStatus(a).localeCompare(getInvoiceStatus(b)) * direction;
      default:
        return 0;
    }
  });

  const handleMarkAsPaid = async (datePaid: string, amountPaid: number) => {
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
            amountPaid
          }
        })
      });

      if (!response.ok) throw new Error('Failed to mark as paid');
      
      // Only refresh if it's a full payment or configured to do so
      if (amountPaid >= selectedInvoice.amount) {
        window.location.reload();
      } else {
        setLocalInvoices(current => 
          current.map(inv => 
            inv === selectedInvoice 
              ? { ...inv, amount: inv.amount - amountPaid }
              : inv
          )
        );
        setSelectedInvoice(null);
      }
    } catch (error) {
      console.error('Error marking as paid:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <InvoicePageLayout title="Outstanding Invoices">
      <div className="p-6">
        <div className="mb-4 flex justify-between items-center">
          <div className="flex space-x-2">
            {[
              { field: 'network', label: 'Network' },
              { field: 'amount', label: 'Amount' },
              { field: 'dueDate', label: 'Due Date' },
              { field: 'status', label: 'Status' }
            ].map(({ field, label }) => (
              <button
                key={field}
                onClick={() => handleSort(field as SortField)}
                className={`px-4 py-2 text-sm font-medium border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  sortConfig.field === field
                    ? 'bg-indigo-100 text-indigo-700 border-indigo-300 hover:bg-indigo-200'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {label} {sortConfig.field === field && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </button>
            ))}
          </div>
          <span className="text-sm text-gray-500">
            {sortedInvoices.length} invoices outstanding
          </span>
        </div>

        <InvoiceTable 
          invoices={sortedInvoices}
          onAction={setSelectedInvoice}
          actionLabel="Mark as Paid"
          actionClass="text-green-600 hover:text-green-900"
        />
      </div>

      {selectedInvoice && (
        <PaymentModal
          invoice={selectedInvoice}
          isOpen={!!selectedInvoice}
          isLoading={isLoading}
          onClose={() => setSelectedInvoice(null)}
          onConfirm={handleMarkAsPaid}
        />
      )}
    </InvoicePageLayout>
  );
} 