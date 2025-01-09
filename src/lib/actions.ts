'use server';

import { DashboardData } from './types';
import { headers } from 'next/headers';

export async function getDashboardData(): Promise<DashboardData> {
  try {
    const headersList = headers();
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
      process.stdout.write(`API Error: ${JSON.stringify({
        status: response.status,
        statusText: response.statusText,
        url: apiUrl
      })}\n`);
      throw new Error(`Failed to fetch data: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    process.stdout.write(`Data fetch error: ${error instanceof Error ? error.message : 'Unknown error'}\n`);
    return {
      networkTerms: [],
      toBeInvoiced: [],
      invoices: [],
      paidInvoices: []
    };
  }
} 