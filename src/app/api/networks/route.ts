import { NextResponse } from 'next/server';
import { getGoogleSheets } from '@/lib/sheets';

export async function GET() {
  try {
    // Log environment variables presence
    console.log('API: Environment check', {
      hasClientEmail: !!process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      hasPrivateKey: !!process.env.GOOGLE_SHEETS_PRIVATE_KEY,
      hasProjectId: !!process.env.GOOGLE_SHEETS_PROJECT_ID,
      hasSheetId: !!process.env.CASH_FLOW_PROJECTIONS_EXTENDED_2024_SHEET_ID
    });

    const sheets = await getGoogleSheets();
    console.log('API: Sheets client initialized');

    try {
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

      console.log('API: Data fetched successfully');

      const response = NextResponse.json({
        networkTerms: networkTerms.data.values || [],
        toBeInvoiced: toBeInvoiced.data.values || [],
        invoices: invoices.data.values || [],
        paidInvoices: paidInvoices.data.values || []
      });

      response.headers.set('Access-Control-Allow-Origin', '*');
      return response;

    } catch (fetchError) {
      console.error('API: Sheet fetch error:', {
        message: fetchError.message,
        code: fetchError.code,
        details: fetchError.response?.data?.error
      });
      throw fetchError;
    }

  } catch (error) {
    console.error('API: Fatal error:', {
      name: error.name,
      message: error.message,
      code: error.code,
      details: error.response?.data?.error
    });

    return NextResponse.json(
      { error: 'Failed to fetch sheet data: ' + error.message },
      { status: 500 }
    );
  }
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  const response = new NextResponse(null, { status: 200 });
  
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  
  return response;
} 