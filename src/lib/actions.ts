'use server';

import { DashboardData } from './types';

export async function getDashboardData(): Promise<DashboardData> {
  try {
    // Get absolute URL for API
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const host = process.env.VERCEL_URL || 'localhost:3000';
    const apiUrl = `${protocol}://${host}/api/networks`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      // Log error details without using console.error
      const errorDetails = {
        status: response.status,
        statusText: response.statusText,
        url: apiUrl
      };
      // Use process.stdout for server-side logging
      process.stdout.write(`API Error: ${JSON.stringify(errorDetails)}\n`);
      throw new Error(`Failed to fetch data: ${response.status}`);
    }

    const data = await response.json();
    
    // Log successful response data
    process.stdout.write(`API Success - Data counts: ${JSON.stringify({
      networkTerms: data.networkTerms?.length || 0,
      toBeInvoiced: data.toBeInvoiced?.length || 0,
      invoices: data.invoices?.length || 0,
      paidInvoices: data.paidInvoices?.length || 0
    })}\n`);

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