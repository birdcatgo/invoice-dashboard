'use client';

import { Invoice } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { useState } from 'react';
import { Modal } from '@/components/Modal';

interface Props {
  invoice: Invoice;
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: (datePaid: string, amountPaid: number) => void;
}

export default function PaymentModal({ invoice, isOpen, isLoading, onClose, onConfirm }: Props) {
  const [datePaid, setDatePaid] = useState(new Date().toISOString().split('T')[0]);
  const [amountPaid, setAmountPaid] = useState(invoice.amount);
  const [isPartialPayment, setIsPartialPayment] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(datePaid, amountPaid);
  };

  const remainingAmount = invoice.amount - (invoice.amountPaid || 0);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Mark Invoice as Paid</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Network: {invoice.network}
          </label>
          <div className="mt-1 text-sm text-gray-500">
            Amount Due: {formatCurrency(remainingAmount)}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Date Paid</label>
          <input
            type="date"
            value={datePaid}
            onChange={(e) => setDatePaid(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={isPartialPayment}
              onChange={(e) => {
                setIsPartialPayment(e.target.checked);
                if (!e.target.checked) {
                  setAmountPaid(remainingAmount);
                }
              }}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">Partial Payment</span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Amount Paid</label>
          <input
            type="number"
            step="0.01"
            value={amountPaid}
            onChange={(e) => setAmountPaid(Number(e.target.value))}
            max={remainingAmount}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            disabled={!isPartialPayment}
            required
          />
        </div>

        <div className="mt-5 sm:mt-6 space-x-3">
          <button
            type="submit"
            disabled={isLoading || amountPaid <= 0 || amountPaid > remainingAmount}
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm disabled:opacity-50"
          >
            {isLoading ? "Processing..." : "Confirm Payment"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
} 