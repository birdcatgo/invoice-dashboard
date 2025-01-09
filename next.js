import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function GET() {
  // Debug log to check environment variables
  console.log('Environment Check:', {
    hasClientEmail: !!process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
    clientEmailLength: process.env.GOOGLE_SHEETS_CLIENT_EMAIL?.length,
    hasPrivateKey: !!process.env.GOOGLE_SHEETS_PRIVATE_KEY,
    privateKeyLength: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.length,
    cashFlowId: process.env.CASH_FLOW_PROJECTIONS_EXTENDED_2024_SHEET_ID,
    acaId: process.env.ACA_TRACKING_SHEET_ID
  });

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  try {
    // Test authentication first
    const authClient = await auth.getClient();
    console.log('Auth client created successfully');

    const sheets = google.sheets({ version: 'v4', auth: authClient });

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
    console.error('Detailed error:', {
      name: error.name,
      message: error.message,
      code: error.code,
      stack: error.stack,
    });
    
    return NextResponse.json(
      { error: error.message },
      { status: error.code === 'ENOENT' ? 404 : 401 }
    );
  }
}