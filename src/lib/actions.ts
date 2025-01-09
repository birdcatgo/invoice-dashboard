'use server';

import { DashboardData } from './types';
import { headers } from 'next/headers';

export async function getDashboardData(): Promise<DashboardData> {
  try {
    const headersList = await headers();
    const host = headersList.get('host') || 'localhost:3000';
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const apiUrl = `${protocol}://${host}/api/networks`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch {
    // Return empty data on any error
    return {
      networkTerms: [],
      toBeInvoiced: [],
      invoices: [],
      paidInvoices: []
    };
  }
} 