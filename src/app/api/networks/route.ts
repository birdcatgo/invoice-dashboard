import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function GET() {
  try {
    if (!process.env.CASH_FLOW_PROJECTIONS_EXTENDED_2024_SHEET_ID) {
      return NextResponse.json({ error: 'Missing SHEET_ID environment variable' });
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const sheetId = process.env.CASH_FLOW_PROJECTIONS_EXTENDED_2024_SHEET_ID;
    
    // First, create the Paid Invoices sheet if it doesn't exist
    try {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: sheetId,
        requestBody: {
          requests: [{
            addSheet: {
              properties: {
                title: 'Paid Invoices',
                gridProperties: {
                  rowCount: 1000,
                  columnCount: 3
                }
              }
            }
          }]
        }
      });

      // Add headers to the new sheet
      await sheets.spreadsheets.values.update({
        spreadsheetId: sheetId,
        range: 'Paid Invoices!A1:C1',
        valueInputOption: 'RAW',
        requestBody: {
          values: [['Network', 'Amount', 'Due Date']]
        }
      });
    } catch (error) {
      // Sheet might already exist, continue
    }

    // Now fetch all data
    const [networkTerms, toBeInvoiced, invoices, paidInvoices] = await Promise.all([
      sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: 'Network Terms!A2:I',
      }),
      sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: 'To Be Invoiced!A2:C',
      }),
      sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: 'Invoices!A2:C',
      }),
      sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: 'Paid Invoices!A2:C',
      }),
    ]);

    const processedNetworkTerms = (networkTerms.data.values || []).map(row => {
      // Get the running total from column H (index 7)
      const rawTotal = row[7] || '0';
      
      // Remove currency symbol, commas and convert to number
      const cleanTotal = rawTotal.replace(/[$,]/g, '');
      const runningTotal = parseFloat(cleanTotal);

      return {
        network: row[0] || '',
        offer: row[1] || '',
        payPeriod: parseFloat(row[2]) || 0,
        netTerms: parseInt(row[3]) || 0,
        periodStart: row[4] || '',
        periodEnd: row[5] || '',
        invoiceDue: row[6] || '',
        runningTotal: runningTotal || 0
      };
    });

    const processAmount = (value: string) => {
      // Remove currency symbols and commas, then convert to number
      const cleanValue = value.replace(/[$,]/g, '');
      return parseFloat(cleanValue) || 0;
    };

    const response = NextResponse.json({
      networkTerms: processedNetworkTerms,
      toBeInvoiced: (toBeInvoiced.data.values || []).map(row => ({
        network: row[0] || '',
        amount: processAmount(row[1]),
        dueDate: row[2] || ''
      })),
      invoices: (invoices.data.values || []).map(row => ({
        network: row[0] || '',
        amount: processAmount(row[1]),
        dueDate: row[2] || ''
      })),
      paidInvoices: (paidInvoices.data.values || []).map(row => ({
        network: row[0] || '',
        amount: processAmount(row[1]),
        dueDate: row[2] || ''
      }))
    });

    // Add CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return response;
  } catch (_error) {
    return {
      networkTerms: [],
      toBeInvoiced: [],
      invoices: [],
      paidInvoices: []
    };
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