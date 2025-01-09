'use server';

import { DashboardData } from './types';
import { headers } from 'next/headers';

export async function getDashboardData(): Promise<DashboardData> {
  try {
    // Get the host from headers
    const headersList = headers();
    const host = headersList.get('host') || 'localhost:3000';
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const url = `${protocol}://${host}/api/networks`;

    console.log('Fetching from:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
      next: { revalidate: 0 }
    });

    if (!response.ok) {
      console.error('Fetch error:', {
        status: response.status,
        statusText: response.statusText,
        url
      });
      throw new Error(`Failed to fetch data: ${response.status}`);
    }

    const data = await response.json();
    console.log('Fetched data:', data);
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