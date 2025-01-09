'use server';

import { DashboardData } from '@/lib/types';
import { headers } from 'next/headers';

export async function getDashboardData(): Promise<DashboardData> {
  try {
    const headersList = headers();
    const host = headersList.get('host') || 'localhost:3002';
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    
    const response = await fetch(`${protocol}://${host}/api/networks`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      console.error('Network response was not ok:', response.statusText);
      throw new Error('Failed to fetch dashboard data');
    }

    const data = await response.json();
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