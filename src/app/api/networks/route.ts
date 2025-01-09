import { NextResponse } from 'next/server';
import { getGoogleSheets } from '@/lib/sheets';
import { NetworkTerms, Invoice } from '@/lib/types';

interface SheetRow {
  [key: string]: string | number;
}

export async function GET() {
  console.log('API: Starting request');
  
  try {
    const sheets = await getGoogleSheets();
    console.log('API: Got sheets client');

    const [networkTerms, toBeInvoiced, invoices, paidInvoices] = await Promise.all([
      sheets.spreadsheets.values.get({
        spreadsheetId: process.env.CASH_FLOW_PROJECTIONS_EXTENDED_2024_SHEET_ID,
        range: 'Network Terms!A2:I',
      }),
      sheets.spreadsheets.values.get({
        spreadsheetId: process.env.CASH_FLOW_PROJECTIONS_EXTENDED_2024_SHEET_ID,
        range: 'To Be Invoiced!A2:C',
      }),
      sheets.spreadsheets.values.get({
        spreadsheetId: process.env.CASH_FLOW_PROJECTIONS_EXTENDED_2024_SHEET_ID,
        range: 'Invoices!A2:C',
      }),
      sheets.spreadsheets.values.get({
        spreadsheetId: process.env.CASH_FLOW_PROJECTIONS_EXTENDED_2024_SHEET_ID,
        range: 'Paid Invoices!A2:C',
      }),
    ]);

    const transformNetworkTerms = (rows: SheetRow[]): NetworkTerms[] => {
      return (rows || []).map(row => ({
        network: row[0] || '',
        offer: row[1] || '',
        payPeriod: Number(row[2]),
        netTerms: Number(row[3]),
        periodStart: row[4] || '',
        periodEnd: row[5] || '',
        invoiceDue: row[6] || '',
        runningTotal: Number(row[7])
      }));
    };

    const transformInvoices = (rows: SheetRow[]): Invoice[] => {
      return (rows || []).map(row => ({
        network: row[0] || '',
        amount: Number(row[1]),
        dueDate: row[2] || ''
      }));
    };

    const data = {
      networkTerms: transformNetworkTerms(networkTerms.data.values || []),
      toBeInvoiced: transformInvoices(toBeInvoiced.data.values || []),
      invoices: transformInvoices(invoices.data.values || []),
      paidInvoices: transformInvoices(paidInvoices.data.values || [])
    };

    const response = NextResponse.json(data);
    response.headers.set('Access-Control-Allow-Origin', '*');
    return response;

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request): Promise<Response> {
  try {
    const data: NetworkData = await request.json();
    // ... rest of the function
  }
  catch (error) {
    // ... error handling
  }
} 