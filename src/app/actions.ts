'use server';

import { DashboardData } from '@/lib/types';

export async function getDashboardData(): Promise<DashboardData> {
  try {
    // Get the absolute URL based on environment
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

    // Log the URL we're trying to fetch
    console.log('Fetching from:', `${baseUrl}/api/networks`);

    // Use node-fetch for server-side fetching
    const response = await fetch(`${baseUrl}/api/networks`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: {
        revalidate: 0
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Network response error:', {
        status: response.status,
        statusText: response.statusText,
        url: `${baseUrl}/api/networks`,
        error: errorText
      });
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Data fetched successfully');
    return data;
  } catch (error) {
    console.error('Dashboard data error:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      cause: error instanceof Error ? error.cause : undefined
    });
    
    // Return empty data on error
    return {
      networkTerms: [],
      toBeInvoiced: [],
      invoices: [],
      paidInvoices: []
    };
  }
} 