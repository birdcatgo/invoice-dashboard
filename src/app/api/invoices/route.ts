import { NextResponse } from 'next/server';
import { getGoogleSheets, getSheetIds } from '@/lib/sheets';
import { Invoice } from '@/lib/types';

interface ApiResponse {
  success?: boolean;
  error?: string;
  details?: string;
}

interface RequestBody {
  action: string;
  invoice: Invoice;
}

export async function POST(request: Request) {
  try {
    const { action, invoice }: RequestBody = await request.json();
    const sheets = await getGoogleSheets();
    const sheetIds = await getSheetIds();

    // Log the sheet IDs for reference
    console.log('Available sheet IDs:', sheetIds);

    if (action === 'markAsPaid') {
      // Remove from Invoices sheet
      const invoicesResponse = await sheets.spreadsheets.values.get({
        spreadsheetId: process.env.CASH_FLOW_PROJECTIONS_EXTENDED_2024_SHEET_ID,
        range: 'Invoices!A2:C',
      });

      const invoicesValues = invoicesResponse.data.values || [];
      const invoiceIndex = invoicesValues.findIndex(row => 
        row[0] === invoice.network && 
        parseFloat(row[1].replace(/[$,]/g, '')) === invoice.amount &&
        row[2] === invoice.dueDate
      );

      if (invoiceIndex !== -1) {
        // Delete the row in Invoices sheet
        await sheets.spreadsheets.batchUpdate({
          spreadsheetId: process.env.CASH_FLOW_PROJECTIONS_EXTENDED_2024_SHEET_ID,
          requestBody: {
            requests: [{
              deleteDimension: {
                range: {
                  sheetId: 419512147, // Invoices sheet ID
                  dimension: 'ROWS',
                  startIndex: invoiceIndex + 1,
                  endIndex: invoiceIndex + 2
                }
              }
            }]
          }
        });

        // Add to Paid Invoices sheet with payment details
        await sheets.spreadsheets.values.append({
          spreadsheetId: process.env.CASH_FLOW_PROJECTIONS_EXTENDED_2024_SHEET_ID,
          range: 'Paid Invoices!A:E',
          valueInputOption: 'USER_ENTERED',
          requestBody: {
            values: [[
              invoice.network,
              invoice.amount,
              invoice.dueDate,
              invoice.datePaid || new Date().toISOString().split('T')[0],
              invoice.amountPaid || invoice.amount
            ]]
          }
        });

        return NextResponse.json({ success: true } as ApiResponse);
      }

      return NextResponse.json({ 
        error: 'Invoice not found',
        details: 'Could not find the invoice in the sheet'
      } as ApiResponse, { status: 404 });
    }

    if (action === 'undoPaid') {
      // Add back to Invoices sheet
      await sheets.spreadsheets.values.append({
        spreadsheetId: process.env.CASH_FLOW_PROJECTIONS_EXTENDED_2024_SHEET_ID,
        range: 'Invoices!A:C',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [[
            invoice.network,
            invoice.amount,
            invoice.dueDate
          ]]
        }
      });

      // Remove from Paid Invoices sheet
      const paidResponse = await sheets.spreadsheets.values.get({
        spreadsheetId: process.env.CASH_FLOW_PROJECTIONS_EXTENDED_2024_SHEET_ID,
        range: 'Paid Invoices!A2:E',
      });

      const paidValues = paidResponse.data.values || [];
      const paidIndex = paidValues.findIndex(row => 
        row[0] === invoice.network && 
        parseFloat(row[1].replace(/[$,]/g, '')) === invoice.amount &&
        row[2] === invoice.dueDate
      );

      if (paidIndex !== -1) {
        // Delete the row in Paid Invoices sheet
        await sheets.spreadsheets.batchUpdate({
          spreadsheetId: process.env.CASH_FLOW_PROJECTIONS_EXTENDED_2024_SHEET_ID,
          requestBody: {
            requests: [{
              deleteDimension: {
                range: {
                  sheetId: 1944485995, // Paid Invoices sheet ID
                  dimension: 'ROWS',
                  startIndex: paidIndex + 1,
                  endIndex: paidIndex + 2
                }
              }
            }]
          }
        });
      }

      return NextResponse.json({ success: true } as ApiResponse);
    }

    if (action === 'updatePaymentDetails') {
      const paidResponse = await sheets.spreadsheets.values.get({
        spreadsheetId: process.env.CASH_FLOW_PROJECTIONS_EXTENDED_2024_SHEET_ID,
        range: 'Paid Invoices!A2:E',
      });

      const paidValues = paidResponse.data.values || [];
      const paidIndex = paidValues.findIndex(row => 
        row[0] === invoice.network && 
        parseFloat(row[1].replace(/[$,]/g, '')) === invoice.amount &&
        row[2] === invoice.dueDate
      );

      if (paidIndex !== -1) {
        await sheets.spreadsheets.values.update({
          spreadsheetId: process.env.CASH_FLOW_PROJECTIONS_EXTENDED_2024_SHEET_ID,
          range: `Paid Invoices!D${paidIndex + 2}:E${paidIndex + 2}`,
          valueInputOption: 'USER_ENTERED',
          requestBody: {
            values: [[
              invoice.datePaid,
              invoice.amountPaid
            ]]
          }
        });

        return NextResponse.json({ success: true } as ApiResponse);
      }

      return NextResponse.json({ 
        error: 'Invoice not found',
        details: 'Could not find the invoice in the paid sheet'
      } as ApiResponse, { status: 404 });
    }

    return NextResponse.json({ 
      error: 'Invalid action',
      details: 'The requested action is not supported'
    } as ApiResponse, { status: 400 });

  } catch (error) {
    console.error('Invoice API Error:', error);
    return NextResponse.json({
      error: 'Failed to process invoice action',
      details: error instanceof Error ? error.message : 'Unknown error occurred'
    } as ApiResponse, { status: 500 });
  }
} 