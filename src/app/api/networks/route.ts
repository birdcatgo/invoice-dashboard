import { NextResponse } from 'next/server';
import { getGoogleSheets } from '@/lib/sheets';
import { NetworkTerms, Invoice } from '@/lib/types';
import { formatDate } from '@/lib/utils';

interface GoogleSheetRow {
  [index: number]: string;
}

export async function GET() {
  try {
    // Log environment check
    console.log('API Route Environment:', {
      nodeEnv: process.env.NODE_ENV,
      hasGoogleCreds: !!process.env.GOOGLE_SHEETS_CLIENT_EMAIL && !!process.env.GOOGLE_SHEETS_PRIVATE_KEY,
      hasSheetId: !!process.env.CASH_FLOW_PROJECTIONS_EXTENDED_2024_SHEET_ID
    });

    const sheets = await getGoogleSheets();
    console.log('Sheets client initialized');

    try {
      const [networkTerms, toBeInvoiced, invoices, paidInvoices] = await Promise.all([
        sheets.spreadsheets.values.get({
          spreadsheetId: process.env.CASH_FLOW_PROJECTIONS_EXTENDED_2024_SHEET_ID,
          range: "'Network Terms'!A2:I",
        }).catch(e => {
          console.error('Error fetching Network Terms:', e);
          throw e;
        }),
        sheets.spreadsheets.values.get({
          spreadsheetId: process.env.CASH_FLOW_PROJECTIONS_EXTENDED_2024_SHEET_ID,
          range: "'To Be Invoiced'!A2:C",
        }).catch(e => {
          console.error('Error fetching To Be Invoiced:', e);
          throw e;
        }),
        sheets.spreadsheets.values.get({
          spreadsheetId: process.env.CASH_FLOW_PROJECTIONS_EXTENDED_2024_SHEET_ID,
          range: "'Invoices'!A2:C",
        }).catch(e => {
          console.error('Error fetching Invoices:', e);
          throw e;
        }),
        sheets.spreadsheets.values.get({
          spreadsheetId: process.env.CASH_FLOW_PROJECTIONS_EXTENDED_2024_SHEET_ID,
          range: "'Paid Invoices'!A2:E",
        }).catch(e => {
          console.error('Error fetching Paid Invoices:', e);
          throw e;
        }),
      ]);

      console.log('Raw Sheet Data:', {
        networkTermsLength: networkTerms.data.values?.length || 0,
        toBeInvoicedLength: toBeInvoiced.data.values?.length || 0,
        invoicesLength: invoices.data.values?.length || 0,
        paidInvoicesLength: paidInvoices.data.values?.length || 0
      });

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

      const paidInvoicesValues = paidInvoices.data.values || [];
      const transformedPaidInvoices = paidInvoicesValues.map(row => ({
        network: row[0] || '',
        amount: parseAmount(row[1]),
        dueDate: row[2] || '',
        datePaid: row[3] || '',
        amountPaid: parseAmount(row[4])
      }));

      const responseData = {
        networkTerms: transformNetworkTerms(networkTerms.data.values || []),
        toBeInvoiced: transformInvoices(toBeInvoiced.data.values || []),
        invoices: transformInvoices(invoices.data.values || []),
        paidInvoices: transformedPaidInvoices
      };

      process.stdout.write(`API: Data transformed - Counts: ${JSON.stringify({
        networkTerms: responseData.networkTerms.length,
        toBeInvoiced: responseData.toBeInvoiced.length,
        invoices: responseData.invoices.length,
        paidInvoices: responseData.paidInvoices.length
      })}\n`);

      const response = NextResponse.json(responseData);
      response.headers.set('Access-Control-Allow-Origin', '*');
      return response;

    } catch (e) {
      console.error('Error in Promise.all:', e);
      throw e;
    }

  } catch (error: unknown) {
    console.error('Full API Error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      error  // Log the full error object
    });
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request): Promise<Response> {
  try {
    const data = await request.json();
    console.log('POST request data:', data);

    // Initialize sheets with error handling
    let sheets;
    try {
      sheets = await getGoogleSheets();
      console.log('Google Sheets client initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Google Sheets:', error);
      return NextResponse.json({
        error: 'Failed to connect to Google Sheets',
        details: error instanceof Error ? error.message : 'Authentication failed'
      }, { status: 500 });
    }

    if (data.action === 'pushMultipleToBeInvoiced') {
      try {
        console.log('Attempting to push invoices:', {
          count: data.invoices.length,
          spreadsheetId: process.env.CASH_FLOW_PROJECTIONS_EXTENDED_2024_SHEET_ID,
        });

        // First, append to To Be Invoiced sheet
        await sheets.spreadsheets.values.append({
          spreadsheetId: process.env.CASH_FLOW_PROJECTIONS_EXTENDED_2024_SHEET_ID,
          range: "'To Be Invoiced'!A:G",
          valueInputOption: 'USER_ENTERED',
          insertDataOption: 'INSERT_ROWS',
          requestBody: {
            values: data.invoices.map((invoice: Invoice) => [
              invoice.network,
              `${formatDate(invoice.periodStart)} - ${formatDate(invoice.periodEnd)}`,
              formatDate(invoice.periodStart),
              formatDate(invoice.periodEnd),
              Number(invoice.amount).toFixed(2),
              Number(invoice.dashAmount || invoice.amount).toFixed(2),
              invoice.isReadyToInvoice ? 'Ready to Invoice' : 'Pending'
            ])
          }
        });

        console.log('Successfully appended data to To Be Invoiced sheet');

        // Get current Network Terms data
        const networkTermsResponse = await sheets.spreadsheets.values.get({
          spreadsheetId: process.env.CASH_FLOW_PROJECTIONS_EXTENDED_2024_SHEET_ID,
          range: "'Network Terms'!A2:I",
        });

        const networkTermsValues = networkTermsResponse.data.values || [];
        
        // Track networks that need running total reset
        const networksToReset = new Set(data.invoices.map((invoice: Invoice) => invoice.network));
        
        // Find all rows for the networks we're processing
        const updates = networkTermsValues.map((row, index) => {
          const network = row[0];
          if (networksToReset.has(network)) {
            return {
              rowIndex: index + 2, // +2 because we start at A2
              network,
              currentTotal: parseFloat(row[7].replace(/[$,]/g, '') || '0'),
              periodEnd: row[5],
              payPeriod: parseInt(row[2]) || 7
            };
          }
          return null;
        }).filter(Boolean);

        console.log('Networks to update:', updates);

        // Update each network
        for (const update of updates) {
          if (!update) continue;

          // Reset running total to 0
          await sheets.spreadsheets.values.update({
            spreadsheetId: process.env.CASH_FLOW_PROJECTIONS_EXTENDED_2024_SHEET_ID,
            range: `'Network Terms'!H${update.rowIndex}`, // Column H is running total
            valueInputOption: 'USER_ENTERED',
            requestBody: {
              values: [[0]]
            }
          });

          // Update period dates
          const lastEndDate = new Date(update.periodEnd);
          const newStartDate = new Date(lastEndDate);
          newStartDate.setDate(newStartDate.getDate() + 1);
          
          const newEndDate = new Date(newStartDate);
          newEndDate.setDate(newEndDate.getDate() + update.payPeriod - 1);

          await sheets.spreadsheets.values.update({
            spreadsheetId: process.env.CASH_FLOW_PROJECTIONS_EXTENDED_2024_SHEET_ID,
            range: `'Network Terms'!E${update.rowIndex}:F${update.rowIndex}`, // Columns E-F are periodStart and periodEnd
            valueInputOption: 'USER_ENTERED',
            requestBody: {
              values: [[
                formatDate(newStartDate.toISOString()),
                formatDate(newEndDate.toISOString())
              ]]
            }
          });
        }

        return NextResponse.json({ 
          success: true,
          message: 'Successfully pushed data and updated Network Terms',
          updatedNetworks: updates.map(u => u?.network)
        });

      } catch (error) {
        console.error('Error in pushMultipleToBeInvoiced:', {
          error,
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined
        });
        
        return NextResponse.json({ 
          error: 'Failed to push data',
          details: error instanceof Error ? error.message : 'Failed to update sheets'
        }, { status: 500 });
      }
    }

    if (data.action === 'updateDashAmount') {
      await sheets.spreadsheets.values.update({
        spreadsheetId: process.env.CASH_FLOW_PROJECTIONS_EXTENDED_2024_SHEET_ID,
        range: "'Network Terms'!J2:J", // Assuming column J is for Dash Amount
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [[data.dashAmount]]
        }
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ 
      error: 'Invalid action',
      details: 'The requested action is not supported'
    }, { status: 400 });

  } catch (error) {
    console.error('POST Error:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    
    return NextResponse.json({ 
      error: 'Failed to process request',
      details: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  }
} 