'use server';

import { DashboardData } from './types';

export async function getDashboardData(): Promise<DashboardData> {
  try {
    const response = await fetch('/api/networks', {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'x-environment': process.env.NODE_ENV || 'unknown'
      },
      cache: 'no-store',
      next: { revalidate: 0 }
    });

    if (!response.ok) {
      console.error('API Response Error:', {
        status: response.status,
        statusText: response.statusText,
        environment: process.env.NODE_ENV
      });
      throw new Error(`Failed to fetch data: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Dashboard Data Error:', {
      error,
      environment: process.env.NODE_ENV
    });
    return {
      networkTerms: [],
      toBeInvoiced: [],
      invoices: [],
      paidInvoices: []
    };
  }
} 