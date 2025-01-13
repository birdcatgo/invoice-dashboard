'use client';

import { useState, useEffect } from 'react';
import { Invoice } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/utils';

interface Props {
  overdueInvoices: Invoice[];
}

interface FollowUp {
  invoice: Invoice;
  notes: string;
  followedUp: boolean;
  followUpDate?: string;
}

export default function TodoList({ overdueInvoices }: Props) {
  const [followUps, setFollowUps] = useState<Record<string, FollowUp>>({});
  const [isInitialized, setIsInitialized] = useState(false);

  // Load data from localStorage only on client side
  useEffect(() => {
    const saved = localStorage.getItem('invoiceFollowUps');
    if (saved) {
      setFollowUps(JSON.parse(saved));
    }
    setIsInitialized(true);
  }, []);

  const handleFollowUpChange = (invoice: Invoice, field: 'notes' | 'followedUp', value: string | boolean) => {
    const invoiceKey = `${invoice.network}-${invoice.amount}-${invoice.dueDate}`;
    const updatedFollowUp = {
      ...followUps[invoiceKey],
      invoice,
      [field]: value,
      followUpDate: field === 'followedUp' && value ? new Date().toISOString().split('T')[0] : followUps[invoiceKey]?.followUpDate
    };
    
    const newFollowUps = {
      ...followUps,
      [invoiceKey]: updatedFollowUp
    };
    
    setFollowUps(newFollowUps);
    localStorage.setItem('invoiceFollowUps', JSON.stringify(newFollowUps));
  };

  // Don't render until we've loaded data from localStorage
  if (!isInitialized) {
    return null;
  }

  return (
    <div>
      {/* Overdue Follow-ups Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-red-700">Overdue Follow-ups</h2>
        {overdueInvoices.length === 0 ? (
          <p className="text-gray-500 italic">No overdue invoices to follow up</p>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Network</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Notes</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Followed Up</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Follow-up Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {overdueInvoices.map((invoice, index) => {
                  const invoiceKey = `${invoice.network}-${invoice.amount}-${invoice.dueDate}`;
                  const followUp = followUps[invoiceKey] || { notes: '', followedUp: false };
                  
                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {invoice.network}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(invoice.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(invoice.dueDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="text"
                          className="border rounded px-2 py-1 w-full text-sm"
                          value={followUp.notes || ''}
                          onChange={(e) => handleFollowUpChange(invoice, 'notes', e.target.value)}
                          placeholder="Add follow-up notes..."
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <input
                          type="checkbox"
                          checked={followUp.followedUp}
                          onChange={(e) => handleFollowUpChange(invoice, 'followedUp', e.target.checked)}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {followUp.followUpDate ? formatDate(followUp.followUpDate) : '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 