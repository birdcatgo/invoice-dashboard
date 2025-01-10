import { google } from 'googleapis';

export async function getGoogleSheets() {
  try {
    console.log('Initializing Google Sheets client...');
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
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets.readonly',
        'https://www.googleapis.com/auth/spreadsheets'
      ],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    console.log('Google Sheets client initialized successfully');
    return sheets;
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

export async function getSheetIds() {
  try {
    const sheets = await getGoogleSheets();
    
    const response = await sheets.spreadsheets.get({
      spreadsheetId: process.env.CASH_FLOW_PROJECTIONS_EXTENDED_2024_SHEET_ID,
    });

    const sheetIds = response.data.sheets?.reduce((acc, sheet) => {
      if (sheet.properties?.title && typeof sheet.properties?.sheetId === 'number') {
        acc[sheet.properties.title] = sheet.properties.sheetId;
      }
      return acc;
    }, {} as Record<string, number>);

    console.log('Sheet IDs:', sheetIds);
    return sheetIds;
  } catch (error) {
    console.error('Failed to get sheet IDs:', error);
    throw error;
  }
} 