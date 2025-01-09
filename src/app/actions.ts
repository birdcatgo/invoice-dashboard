'use server';

import { DashboardData } from '@/lib/types';

export async function getDashboardData(): Promise<DashboardData> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || `http://localhost:${process.env.PORT || 3002}`;
    const response = await fetch(`${baseUrl}/api/networks`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      console.error('Network response was not ok:', response.statusText);
      throw new Error('Failed to fetch dashboard data');
    }

    const data = await response.json();
    console.log('Fetched data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return {
      networkTerms: [],
      toBeInvoiced: [],
      invoices: [],
      paidInvoices: []
    };
  }
} 