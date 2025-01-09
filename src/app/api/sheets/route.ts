import { google } from 'googleapis';
import { NextResponse } from 'next/server';

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
    console.error('API Error:', {
      message: error.message,
      code: error.code,
      status: error.status,
      details: error.response?.data?.error?.message
    });
    
    return NextResponse.json(
      { 
        error: 'Authentication failed',
        details: error.response?.data?.error?.message || error.message
      },
      { status: 401 }
    );
  }
}