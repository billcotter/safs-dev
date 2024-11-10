// src/lib/sheets/client.ts
import { GoogleSpreadsheet } from 'google-spreadsheet';
import type { JWT } from 'google-auth-library';

// Type definition for our film data from sheets
interface SheetFilmData {
  Title: string;
  Year: string;
  imdbID?: string;
  // ... other fields as per your sheet
}

class GoogleSheetsClient {
  private doc: GoogleSpreadsheet;
  private initialized = false;

  constructor() {
    // Create JWT credentials from environment variables
    const credentials: JWT = {
      email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL!,
      key: process.env.GOOGLE_SHEETS_PRIVATE_KEY!.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    };

    this.doc = new GoogleSpreadsheet(
      process.env.GOOGLE_SHEETS_DOC_ID!,
      credentials
    );
  }

  async init() {
    if (!this.initialized) {
      await this.doc.loadInfo();
      this.initialized = true;
    }
  }

  async getFilmData(): Promise<SheetFilmData[]> {
    await this.init();
    const sheet = this.doc.sheetsByIndex[0]; // Assuming first sheet
    const rows = await sheet.getRows();

    return rows.map((row) => ({
      Title: row.Title,
      Year: row.Year,
      imdbID: row.imdbID,
      // Map other fields as needed
    }));
  }
}

export const sheetsClient = new GoogleSheetsClient();
