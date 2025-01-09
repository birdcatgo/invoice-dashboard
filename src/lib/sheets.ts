import { google } from 'googleapis';

export async function getGoogleSheets() {
  try {
    console.log('Initializing Google Sheets client...', {
      hasEmail: !!process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      hasKey: !!process.env.GOOGLE_SHEETS_PRIVATE_KEY,
      environment: process.env.NODE_ENV
    });
    
    if (!process.env.GOOGLE_SHEETS_CLIENT_EMAIL || !process.env.GOOGLE_SHEETS_PRIVATE_KEY) {
      throw new Error('Missing Google Sheets credentials');
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n')
          .replace(/\n/g, '\n')
          .replace(/"/, ''),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    console.log('Auth created, getting sheets client...');
    return google.sheets({ version: 'v4', auth });
  } catch (error) {
    console.error('Failed to initialize Google Sheets:', {
      error,
      environment: process.env.NODE_ENV,
      hasEmail: !!process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      hasKey: !!process.env.GOOGLE_SHEETS_PRIVATE_KEY
    });
    throw error;
  }
} 