'use server';

import { DashboardData } from './types';

export async function getDashboardData(): Promise<DashboardData> {
  try {
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_VERCEL_URL 
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : 'http://localhost:3000';
      
    console.log('Fetching from URL:', baseUrl);
    
    const response = await fetch(`${baseUrl}/api/networks`, {
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
        url: baseUrl,
        environment: process.env.NODE_ENV,
        vercelUrl: process.env.VERCEL_URL,
        publicVercelUrl: process.env.NEXT_PUBLIC_VERCEL_URL
      });
      throw new Error(`Failed to fetch data: ${response.status}`);
    }

    const data = await response.json();
    console.log('API Response Data:', {
      networkTermsCount: data.networkTerms?.length || 0,
      toBeInvoicedCount: data.toBeInvoiced?.length || 0,
      invoicesCount: data.invoices?.length || 0,
      paidInvoicesCount: data.paidInvoices?.length || 0
    });
    
    return data;
  } catch (error) {
    console.error('Dashboard Data Error:', {
      error,
      environment: process.env.NODE_ENV,
      vercelUrl: process.env.VERCEL_URL,
      publicVercelUrl: process.env.NEXT_PUBLIC_VERCEL_URL
    });
    return {
      networkTerms: [],
      toBeInvoiced: [],
      invoices: [],
      paidInvoices: []
    };
  }
} 