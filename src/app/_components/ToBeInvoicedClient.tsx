'use client';

import { useState } from 'react';
import { DashboardData } from '@/lib/types';
import InvoicePageLayout from '@/components/InvoicePageLayout';
import { formatCurrency, formatDate } from '@/lib/utils';

interface Props {
  data: DashboardData;
}

interface NetworkPeriod {
  network: string;
  periodStart: string;
  periodEnd: string;
  amount: number;
  dashAmount: number;
  isReadyToInvoice: boolean;
  payPeriod: number;
}

export default function ToBeInvoicedClient({ data }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [editingNetwork, setEditingNetwork] = useState<string | null>(null);
  const [dashAmounts, setDashAmounts] = useState<Record<string, number>>({});
  const [selectedPeriods, setSelectedPeriods] = useState<string[]>([]);

  const handleDashAmountUpdate = async (network: string, amount: number) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/networks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'updateDashAmount',
          network,
          dashAmount: amount
        })
      });

      if (!response.ok) throw new Error('Failed to update dash amount');
      
      setDashAmounts(prev => ({
        ...prev,
        [network]: amount
      }));
      setEditingNetwork(null);
    } catch (error) {
      console.error('Error updating dash amount:', error);
      alert('Failed to update dash amount');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePushSelected = async () => {
    setIsLoading(true);
    try {
      const selectedItems = networkPeriods.filter(period => 
        selectedPeriods.includes(period.network)
      );

      const response = await fetch('/api/networks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'pushMultipleToBeInvoiced',
          invoices: selectedItems.map(period => ({
            network: period.network,
            periodStart: period.periodStart,
            periodEnd: period.periodEnd,
            amount: period.amount,
            dashAmount: period.dashAmount,
            isReadyToInvoice: period.isReadyToInvoice
          }))
        })
      });

      if (!response.ok) throw new Error('Failed to push to sheet');
      alert('Successfully pushed selected items to To Be Invoiced sheet');
      window.location.reload();
    } catch (error) {
      console.error('Error pushing to sheet:', error);
      alert('Failed to push to sheet');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAll = () => {
    if (selectedPeriods.length === networkPeriods.length) {
      setSelectedPeriods([]);
    } else {
      setSelectedPeriods(networkPeriods.map(p => p.network));
    }
  };

  const networkPeriods = data.networkTerms
    .filter(network => network.runningTotal > 0)
    .map(network => ({
      network: network.network,
      periodStart: network.periodStart,
      periodEnd: network.periodEnd,
      amount: network.runningTotal,
      dashAmount: dashAmounts[network.network] || network.dashAmount || 0,
      isReadyToInvoice: new Date(network.periodEnd) <= new Date(),
      payPeriod: network.payPeriod
    }))
    .sort((a, b) => {
      if (a.isReadyToInvoice !== b.isReadyToInvoice) {
        return a.isReadyToInvoice ? -1 : 1;
      }
      return a.network.localeCompare(b.network);
    });

  const readyToInvoiceCount = networkPeriods.filter(p => p.isReadyToInvoice).length;

  return (
    <InvoicePageLayout title="To Be Invoiced">
      <div className="p-6">
        <div className="mb-4 flex items-center justify-between bg-white p-4 rounded-lg shadow">
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 text-indigo-600"
                checked={selectedPeriods.length === networkPeriods.length}
                onChange={handleSelectAll}
              />
              <span className="ml-2 text-sm text-gray-700">Select All</span>
            </label>
            <span className="text-sm text-gray-500">
              {selectedPeriods.length} selected / {readyToInvoiceCount} ready
            </span>
          </div>
          <button
            onClick={handlePushSelected}
            disabled={isLoading || selectedPeriods.length === 0}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isLoading ? "Pushing..." : "Push Selected to Sheet"}
          </button>
        </div>

        <div className="bg-white shadow rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  <span className="sr-only">Select</span>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Network</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Period</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pay Period</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dash Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {networkPeriods.map((period, index) => (
                <tr key={index} className={`hover:bg-gray-50 ${period.isReadyToInvoice ? 'bg-green-50' : ''}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-indigo-600"
                      checked={selectedPeriods.includes(period.network)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedPeriods([...selectedPeriods, period.network]);
                        } else {
                          setSelectedPeriods(selectedPeriods.filter(n => n !== period.network));
                        }
                      }}
                      disabled={!period.isReadyToInvoice}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {period.network}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(period.periodStart)} - {formatDate(period.periodEnd)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {period.payPeriod} days
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(period.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {editingNetwork === period.network ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          step="0.01"
                          defaultValue={period.dashAmount}
                          className="w-32 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              const input = e.currentTarget as HTMLInputElement;
                              handleDashAmountUpdate(period.network, parseFloat(input.value));
                            } else if (e.key === 'Escape') {
                              setEditingNetwork(null);
                            }
                          }}
                          autoFocus
                        />
                      </div>
                    ) : (
                      <div 
                        className="cursor-pointer hover:text-indigo-600"
                        onClick={() => setEditingNetwork(period.network)}
                      >
                        {formatCurrency(period.dashAmount)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {period.isReadyToInvoice ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Ready to Invoice
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Pending
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </InvoicePageLayout>
  );
} 