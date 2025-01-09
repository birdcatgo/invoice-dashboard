import { NextResponse } from 'next/server';
import { getGoogleSheets } from '@/lib/sheets';

export async function GET() {
  try {
    const sheets = await getGoogleSheets();
    // Fetch raw data from 'Raw Data' sheet
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range: 'Raw Data!A2:G',  // Adjust range based on your data
    });

    const data = response.data.values?.map(row => ({
      networkId: row[0],
      date: row[1],
      amount: parseFloat(row[2]) || 0,
      clicks: parseInt(row[3]) || 0,
      conversions: parseInt(row[4]) || 0
    })) || [];

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch raw data' }, { status: 500 });
  }
} 