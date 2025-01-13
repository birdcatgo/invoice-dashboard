'use client';

import { Invoice } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

interface Props {
  invoice: Invoice;
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: (datePaid: string, amountPaid: number) => void;
}

export default function PaymentModal({ invoice, isOpen, isLoading, onClose, onConfirm }: Props) {
  if (!isOpen) return null;

  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const datePaid = formData.get('datePaid') as string;
    console.log('Date from modal:', datePaid);
    const amountPaid = parseFloat(formData.get('amountPaid') as string);
    onConfirm(datePaid, amountPaid);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Confirm Payment Details
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <p className="text-sm text-gray-500">
                Network: {invoice.network}
              </p>
              <p className="text-sm text-gray-500">
                Expected Amount: {formatCurrency(invoice.amount)}
              </p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date Paid
              </label>
              <input
                type="date"
                name="datePaid"
                defaultValue={today}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount Received
              </label>
              <input
                type="number"
                name="amountPaid"
                step="0.01"
                defaultValue={invoice.amount}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                {isLoading ? "Processing..." : "Confirm Payment"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 