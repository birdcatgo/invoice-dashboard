import { google } from 'googleapis';

export async function getGoogleSheets() {
  try {
    if (!process.env.GOOGLE_SHEETS_CLIENT_EMAIL) {
      throw new Error('Missing GOOGLE_SHEETS_CLIENT_EMAIL');
    }
    if (!process.env.GOOGLE_SHEETS_PRIVATE_KEY) {
      throw new Error('Missing GOOGLE_SHEETS_PRIVATE_KEY');
    }
    if (!process.env.CASH_FLOW_PROJECTIONS_EXTENDED_2024_SHEET_ID) {
      throw new Error('Missing SHEET_ID');
    }

    // Format private key properly
    const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY
      .replace(/\\n/g, '\n')
      .replace(/\n/g, '\n')
      .replace(/["']/g, '');

    console.log('Auth Setup:', {
      hasValidEmail: process.env.GOOGLE_SHEETS_CLIENT_EMAIL.includes('@'),
      privateKeyLength: privateKey.length,
      sheetIdLength: process.env.CASH_FLOW_PROJECTIONS_EXTENDED_2024_SHEET_ID.length
    });

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
        private_key: privateKey,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    return google.sheets({ version: 'v4', auth });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Google Sheets initialization error:', {
      message: errorMessage,
      environment: process.env.NODE_ENV,
      hasEmail: !!process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      hasKey: !!process.env.GOOGLE_SHEETS_PRIVATE_KEY,
      hasSheetId: !!process.env.CASH_FLOW_PROJECTIONS_EXTENDED_2024_SHEET_ID
    });
    throw error;
  }
} 