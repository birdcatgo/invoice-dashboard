import { google } from 'googleapis';
import { NextResponse } from 'next/server';

interface GoogleAPIError {
  message?: string;
  code?: string | number;
  status?: number;
  response?: {
    data?: {
      error?: {
        message?: string;
      };
    };
  };
}

export async function GET() {
  // Check required environment variables
  if (!process.env.GOOGLE_SHEETS_CLIENT_EMAIL) {
    console.error('Missing GOOGLE_SHEETS_CLIENT_EMAIL');
    return NextResponse.json({ error: 'Missing credentials' }, { status: 500 });
  }

  if (!process.env.GOOGLE_SHEETS_PRIVATE_KEY) {
    console.error('Missing GOOGLE_SHEETS_PRIVATE_KEY');
    return NextResponse.json({ error: 'Missing credentials' }, { status: 500 });
  }

  if (!process.env.CASH_FLOW_PROJECTIONS_EXTENDED_2024_SHEET_ID) {
    console.error('Missing CASH_FLOW_PROJECTIONS_EXTENDED_2024_SHEET_ID');
    return NextResponse.json({ error: 'Missing sheet ID' }, { status: 500 });
  }

  // Format private key
  const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY
    .replace(/\\n/g, '\n')
    .replace(/\n/g, '\n');

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
        private_key: privateKey,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Fetch data
    const [cashFlowResponse, networkTermsResponse] = await Promise.all([
      sheets.spreadsheets.values.get({
        spreadsheetId: process.env.CASH_FLOW_PROJECTIONS_EXTENDED_2024_SHEET_ID,
        range: 'Main Sheet!A:K',
      }),
      sheets.spreadsheets.values.get({
        spreadsheetId: process.env.CASH_FLOW_PROJECTIONS_EXTENDED_2024_SHEET_ID,
        range: 'Network Terms!A2:I',
      }),
    ]);

    // Validate responses
    if (!cashFlowResponse.data.values || !networkTermsResponse.data.values) {
      console.error('No data returned from sheets');
      return NextResponse.json({ error: 'No data found' }, { status: 404 });
    }

    return NextResponse.json({
      cashFlow: cashFlowResponse.data.values,
      networkTerms: networkTermsResponse.data.values,
    });

  } catch (error) {
    const apiError = error as GoogleAPIError;
    console.error('Sheets API Error:', {
      message: apiError.message,
      code: apiError.code,
      status: apiError.status,
      details: apiError.response?.data?.error?.message
    });

    return NextResponse.json(
      { error: 'Failed to fetch sheet data' },
      { status: 500 }
    );
  }
}