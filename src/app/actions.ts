'use server';

import { DashboardData } from '@/lib/types';

export async function getDashboardData(): Promise<DashboardData> {
  try {
    // For Vercel, use relative URL which will be automatically resolved
    const response = await fetch(process.env.VERCEL_URL 
      ? 'https://invoice-dashboard-birdcatgo.vercel.app/api/networks'
      : 'http://localhost:3002/api/networks', {
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