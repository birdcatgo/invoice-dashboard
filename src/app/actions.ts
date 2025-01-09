'use server';

import { DashboardData } from '@/lib/types';

export async function getDashboardData(): Promise<DashboardData> {
  try {
    // Get the base URL from environment variables
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

    // Use absolute URL for API request
    const response = await fetch(`${baseUrl}/api/networks`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
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