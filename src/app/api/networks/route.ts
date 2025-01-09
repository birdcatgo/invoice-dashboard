import { NextResponse } from 'next/server';
import { getGoogleSheets } from '@/lib/sheets';
import { NetworkTerms, Invoice } from '@/lib/types';

interface GoogleSheetRow {
  [index: number]: string;
}

interface NetworkData {
  action: string;
  network: string;
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

    // Helper function to parse numbers from strings
    const parseAmount = (value: string | undefined): number => {
      if (!value) return 0;
      // Remove currency symbols and commas, then parse
      const cleaned = value.replace(/[$,]/g, '');
      const number = parseFloat(cleaned);
      return isNaN(number) ? 0 : number;
    };

    const transformNetworkTerms = (rows: GoogleSheetRow[]): NetworkTerms[] => {
      return (rows || []).map(row => ({
        network: row[0] || '',
        offer: row[1] || '',
        payPeriod: parseAmount(row[2]),
        netTerms: parseAmount(row[3]),
        periodStart: row[4] || '',
        periodEnd: row[5] || '',
        invoiceDue: row[6] || '',
        runningTotal: parseAmount(row[7])
      }));
    };

    const transformInvoices = (rows: GoogleSheetRow[]): Invoice[] => {
      return (rows || []).map(row => ({
        network: row[0] || '',
        amount: parseAmount(row[1]),
        dueDate: row[2] || ''
      }));
    };

    const responseData = {
      networkTerms: transformNetworkTerms(networkTerms.data.values || []),
      toBeInvoiced: transformInvoices(toBeInvoiced.data.values || []),
      invoices: transformInvoices(invoices.data.values || []),
      paidInvoices: transformInvoices(paidInvoices.data.values || [])
    };

    console.log('API Response Data:', responseData);

    const response = NextResponse.json(responseData);
    response.headers.set('Access-Control-Allow-Origin', '*');
    return response;

  } catch (err) {
    console.error('API Error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request): Promise<Response> {
  try {
    const networkData = await request.json() as NetworkData;
    return NextResponse.json({ success: true, data: networkData });
  }
  catch (err) {
    console.error('POST Error:', err);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
} 