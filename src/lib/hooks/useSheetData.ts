import { useState, useEffect } from 'react';
import { Transaction, NetworkPaymentTerms } from '@/lib/types';

interface SheetData {
  [key: string]: string | number;
}

export function useSheetData<T extends SheetData>() {
  const [data, setData] = useState<{
    transactions: Transaction[];
    networkTerms: NetworkPaymentTerms[];
    isLoading: boolean;
    error: Error | null;
  }>({
    transactions: [],
    networkTerms: [],
    isLoading: true,
    error: null
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/sheets');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const json = await response.json();

        // Process transactions
        const transactions: Transaction[] = json.cashFlow.slice(1).map((row: any[]) => ({
          date: row[0],
          network: row[1],
          offer: row[2],
          mediaBuyer: row[3],
          adSpend: parseFloat(row[4].replace('$', '').replace(',', '')),
          adRevenue: parseFloat(row[5].replace('$', '').replace(',', '')),
          commentRevenue: parseFloat(row[6].replace('$', '').replace(',', '')),
          totalRevenue: parseFloat(row[7].replace('$', '').replace(',', '')),
          margin: parseFloat(row[8].replace('$', '').replace(',', '')),
          expectedPayment: row[9]
        }));

        // Process network terms
        const networkTerms: NetworkPaymentTerms[] = json.networkTerms.slice(1).map((row: any[]) => ({
          name: row[0],
          netTerms: parseInt(row[1]),
          payPeriod: row[2].toLowerCase() as 'weekly' | 'monthly',
          otherBusinessNames: row[3] || undefined
        }));

        setData({
          transactions,
          networkTerms,
          isLoading: false,
          error: null
        });
      } catch (error) {
        setData(prev => ({
          ...prev,
          isLoading: false,
          error: error as Error
        }));
      }
    }

    fetchData();
  }, []);

  return data;
}