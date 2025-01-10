import { getGoogleSheets } from '@/lib/sheets';
import TodoList from '@/components/TodoList';
import InvoicePageLayout from '@/components/InvoicePageLayout';

// Add revalidation to ensure fresh data
export const revalidate = 0;

export default async function TodoPage() {
  try {
    const sheets = await getGoogleSheets();
    
    // Log to verify API calls
    console.log('Fetching data for Todo page...');
    
    const [networkTerms, invoices] = await Promise.all([
      sheets.spreadsheets.values.get({
        spreadsheetId: process.env.CASH_FLOW_PROJECTIONS_EXTENDED_2024_SHEET_ID,
        range: 'Network Terms!A2:I',
      }),
      sheets.spreadsheets.values.get({
        spreadsheetId: process.env.CASH_FLOW_PROJECTIONS_EXTENDED_2024_SHEET_ID,
        range: 'Invoices!A2:C',
      }),
    ]);

    // Log raw data to verify
    console.log('Raw data received:', {
      networkTermsLength: networkTerms.data.values?.length || 0,
      invoicesLength: invoices.data.values?.length || 0
    });

    const parseAmount = (value: string): number => {
      if (!value) return 0;
      const cleaned = value.replace(/[$,]/g, '');
      const number = parseFloat(cleaned);
      return isNaN(number) ? 0 : number;
    };

    const transformedNetworkTerms = (networkTerms.data.values || []).map(row => ({
      network: row[0] || '',
      offer: row[1] || '',
      payPeriod: parseAmount(row[2]),
      netTerms: parseAmount(row[3]),
      periodStart: row[4] || '',
      periodEnd: row[5] || '',
      invoiceDue: row[6] || '',
      runningTotal: parseAmount(row[7])
    }));

    const transformedInvoices = (invoices.data.values || []).map(row => ({
      network: row[0] || '',
      amount: parseAmount(row[1]),
      dueDate: row[2] || ''
    }));

    const overdueInvoices = transformedInvoices.filter(invoice => 
      new Date(invoice.dueDate) < new Date()
    );

    // Log transformed data to verify
    console.log('Transformed data:', {
      networkTermsCount: transformedNetworkTerms.length,
      overdueInvoicesCount: overdueInvoices.length
    });

    return (
      <InvoicePageLayout title="To-Do List">
        <div className="p-6">
          <TodoList 
            networkTerms={transformedNetworkTerms}
            overdueInvoices={overdueInvoices}
          />
        </div>
      </InvoicePageLayout>
    );
  } catch (error) {
    console.error('Error in TodoPage:', error);
    throw error;
  }
} 