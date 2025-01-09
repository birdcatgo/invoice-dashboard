import { useState, useEffect } from 'react';
import { Transaction, NetworkPaymentTerms } from '@/lib/types';

interface SheetRow {
  [key: string]: string | number;
}

export function useSheetData() {
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
        const transactions: Transaction[] = json.cashFlow.slice(1).map((row: SheetRow) => ({
          date: row[0] as string,
          network: row[1] as string,
          offer: row[2] as string,
          mediaBuyer: row[3] as string,
          adSpend: parseFloat((row[4] as string).replace('$', '').replace(',', '')),
          adRevenue: parseFloat((row[5] as string).replace('$', '').replace(',', '')),
          commentRevenue: parseFloat((row[6] as string).replace('$', '').replace(',', '')),
          totalRevenue: parseFloat((row[7] as string).replace('$', '').replace(',', '')),
          margin: parseFloat((row[8] as string).replace('$', '').replace(',', '')),
          expectedPayment: row[9] as string
        }));

        // Process network terms
        const networkTerms: NetworkPaymentTerms[] = json.networkTerms.slice(1).map((row: SheetRow) => ({
          name: row[0] as string,
          netTerms: parseInt(row[1] as string),
          payPeriod: (row[2] as string).toLowerCase() as 'weekly' | 'monthly',
          otherBusinessNames: row[3] as string | undefined
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