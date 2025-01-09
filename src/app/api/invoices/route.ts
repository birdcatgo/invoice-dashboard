import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { Invoice } from '@/lib/types';

interface InvoiceAction {
  action: 'markAsPaid' | 'markAsInvoiced';
  invoice: Invoice;
  amountPaid?: number;
  datePaid?: string;
}

export async function POST(request: Request) {
  try {
    const data: InvoiceAction = await request.json();
    
    if (!process.env.CASH_FLOW_PROJECTIONS_EXTENDED_2024_SHEET_ID) {
      throw new Error('Missing spreadsheet ID');
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

    switch (data.action) {
      case 'markAsInvoiced':
        await moveInvoice(sheets, sheetId!, 'To Be Invoiced', 'Invoices', data.invoice);
        break;
      case 'markAsPaid':
        await moveInvoice(sheets, sheetId!, 'Invoices', 'Paid Invoices', data.invoice);
        break;
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Invoice action error:', error);
    return NextResponse.json({ error: error?.message || 'An error occurred' }, { status: 500 });
  }
}

async function moveInvoice(sheets: any, sheetId: string, fromSheet: string, toSheet: string, invoice: any) {
  // First, append to destination sheet
  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: `${toSheet}!A:C`,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[invoice.network, invoice.amount, invoice.dueDate]]
    }
  });

  // Then find and delete from source sheet
  const sourceData = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: `${fromSheet}!A:C`,
  });

  const rows = sourceData.data.values || [];
  const rowIndex = rows.findIndex((row: string[]) => 
    row[0] === invoice.network && 
    parseFloat(row[1]) === invoice.amount && 
    row[2] === invoice.dueDate
  );

  if (rowIndex !== -1) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: sheetId,
      requestBody: {
        requests: [{
          deleteDimension: {
            range: {
              sheetId: fromSheet,
              dimension: 'ROWS',
              startIndex: rowIndex + 1, // +1 because of header row
              endIndex: rowIndex + 2
            }
          }
        }]
      }
    });
  }
} 