'use client'
import React from 'react';
import { formatDate } from '@/lib/utils';
import { Transaction, NetworkPaymentTerms } from '@/lib/types';
import { startOfWeek, endOfWeek, addDays, isBefore, isAfter } from 'date-fns';

interface InvoicePeriodTrackerProps {
  transactions: Transaction[];
  networkTerms: NetworkPaymentTerms[];
}

interface Period {
  network: string;
  startDate: Date;
  endDate: Date;
  dueDate: Date;
  amount: number;
  status: 'pending' | 'ready' | 'overdue';
}

export default function InvoicePeriodTracker({ transactions, networkTerms }: InvoicePeriodTrackerProps) {
  const getPeriods = (): Period[] => {
    const periods: Period[] = [];
    const now = new Date();

    networkTerms.forEach(network => {
      const networkTransactions = transactions.filter(t => t.network === network.name);
      
      if (networkTransactions.length === 0) return;

      // Group by week for weekly payment terms
      if (network.payPeriod === 'weekly') {
        const weekGroups = new Map<string, Transaction[]>();
        
        networkTransactions.forEach(transaction => {
          const transDate = new Date(transaction.date);
          const weekStart = startOfWeek(transDate);
          const weekKey = formatDate(weekStart);
          
          if (!weekGroups.has(weekKey)) {
            weekGroups.set(weekKey, []);
          }
          weekGroups.get(weekKey)?.push(transaction);
        });

        weekGroups.forEach((transactions, weekKey) => {
          const startDate = new Date(weekKey);
          const endDate = endOfWeek(startDate);
          const dueDate = addDays(endDate, network.netTerms);
          const amount = transactions.reduce((sum, t) => sum + t.totalRevenue, 0);

          let status: Period['status'] = 'pending';
          if (isBefore(dueDate, now)) {
            status = 'overdue';
          } else if (isAfter(now, endDate)) {
            status = 'ready';
          }

          periods.push({
            network: network.name,
            startDate,
            endDate,
            dueDate,
            amount,
            status
          });
        });
      }
    });

    return periods.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
  };

  const periods = getPeriods();

  return (
    <div className="space-y-4">
      {periods.map((period, index) => (
        <div key={index} className="border rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg">{period.network}</h3>
              <p className="text-sm text-gray-600">
                Period: {formatDate(period.startDate)} - {formatDate(period.endDate)}
              </p>
              <p className="text-sm text-gray-600">
                Due: {formatDate(period.dueDate)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xl font-semibold">${period.amount.toLocaleString()}</p>
              <span className={`inline-block px-2 py-1 text-xs rounded-full mt-2 ${
                period.status === 'overdue' 
                  ? 'bg-red-100 text-red-800'
                  : period.status === 'ready'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
              }`}>
                {period.status.charAt(0).toUpperCase() + period.status.slice(1)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}