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
  // First, properly format the private key
  const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY
    ?.replace(/\\n/g, '\n')
    ?.replace(/\n/g, '\n');  // Handle any additional escaping

  // Log the first and last few characters of credentials (safely)
  console.log('Credentials check:', {
    clientEmail: {
      exists: !!process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      start: process.env.GOOGLE_SHEETS_CLIENT_EMAIL?.slice(0, 5),
    },
    privateKey: {
      exists: !!privateKey,
      startsWithHeader: privateKey?.startsWith('-----BEGIN PRIVATE KEY-----'),
      endsWithFooter: privateKey?.endsWith('-----END PRIVATE KEY-----\n'),
    }
  });

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      private_key: privateKey,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  try {
    // Create sheets instance
    const sheets = google.sheets({ version: 'v4', auth });

    // Test authentication with minimal request
    const test = await sheets.spreadsheets.get({
      spreadsheetId: process.env.CASH_FLOW_PROJECTIONS_EXTENDED_2024_SHEET_ID,
      fields: 'spreadsheetId' // Request minimal data
    });

    console.log('Authentication successful:', test.data.spreadsheetId);

    const [cashFlowResponse, acaTrackingResponse] = await Promise.all([
      sheets.spreadsheets.values.get({
        spreadsheetId: process.env.CASH_FLOW_PROJECTIONS_EXTENDED_2024_SHEET_ID,
        range: 'Main Sheet!A:K',
      }),
      sheets.spreadsheets.values.get({
        spreadsheetId: process.env.ACA_TRACKING_SHEET_ID,
        range: 'raw data!A:C',
      }),
    ]);

    return NextResponse.json({
      cashFlow: cashFlowResponse.data.values,
      networkTerms: acaTrackingResponse.data.values,
    });
  } catch (error) {
    const apiError = error as GoogleAPIError;
    console.error('API Error:', {
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