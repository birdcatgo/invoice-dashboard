import { google } from 'googleapis';

export async function getGoogleSheets() {
  if (!process.env.GOOGLE_SHEETS_CLIENT_EMAIL) {
    throw new Error('Missing GOOGLE_SHEETS_CLIENT_EMAIL');
  }
  if (!process.env.GOOGLE_SHEETS_PRIVATE_KEY) {
    throw new Error('Missing GOOGLE_SHEETS_PRIVATE_KEY');
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        type: 'service_account',
        project_id: process.env.GOOGLE_SHEETS_PROJECT_ID,
        private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, '\n'),
        client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
        token_uri: 'https://oauth2.googleapis.com/token',
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    
    // Test the connection
    await sheets.spreadsheets.get({
      spreadsheetId: process.env.CASH_FLOW_PROJECTIONS_EXTENDED_2024_SHEET_ID,
    });

    return sheets;
  } catch (error) {
    console.error('Sheets initialization error:', {
      message: error.message,
      stack: error.stack
    });
    throw error;
  }
} 