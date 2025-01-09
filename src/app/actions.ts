'use server';

import type { DashboardData } from '../lib/types';

export async function getDashboardData(): Promise<DashboardData> {
  try {
    const response = await fetch('http://localhost:3005/api/networks', {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error);
    return {
      networkTerms: [],
      toBeInvoiced: [],
      invoices: [],
      paidInvoices: []
    };
  }
} 