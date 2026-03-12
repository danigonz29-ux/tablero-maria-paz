/**
 * Google Sheets API Route (Service Account mode)
 *
 * HOW TO CONFIGURE:
 * 1. Go to Google Cloud Console -> APIs & Services -> Enable "Google Sheets API"
 * 2. Create a Service Account -> Download JSON key
 * 3. Set these environment variables:
 *    - GOOGLE_SERVICE_ACCOUNT_EMAIL: The service account email
 *    - GOOGLE_PRIVATE_KEY: The private key from the JSON (include \n characters)
 * 4. Share the Google Sheet with the service account email (Editor role)
 *
 * For OAuth (client-side) mode, no env vars needed — the frontend handles it directly.
 */

import { NextRequest, NextResponse } from "next/server";

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

async function getAccessToken(): Promise<string> {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!email || !key) {
    throw new Error("Missing GOOGLE_SERVICE_ACCOUNT_EMAIL or GOOGLE_PRIVATE_KEY");
  }

  // Create JWT for service account
  const header = btoa(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const now = Math.floor(Date.now() / 1000);
  const claimSet = btoa(
    JSON.stringify({
      iss: email,
      scope: SCOPES.join(" "),
      aud: "https://oauth2.googleapis.com/token",
      exp: now + 3600,
      iat: now,
    })
  );

  const signInput = `${header}.${claimSet}`;

  // Import the private key and sign
  const keyData = key
    .replace(/-----BEGIN PRIVATE KEY-----/, "")
    .replace(/-----END PRIVATE KEY-----/, "")
    .replace(/\s/g, "");

  const binaryKey = Uint8Array.from(atob(keyData), (c) => c.charCodeAt(0));

  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8",
    binaryKey,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    cryptoKey,
    new TextEncoder().encode(signInput)
  );

  const sig = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  const jwt = `${header}.${claimSet}.${sig}`;

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`,
  });

  const tokenData = await tokenRes.json();
  if (!tokenData.access_token) {
    throw new Error(`Token error: ${JSON.stringify(tokenData)}`);
  }
  return tokenData.access_token;
}

// GET: Read all tabs from the spreadsheet
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const spreadsheetId = searchParams.get("spreadsheetId");
    const tabs = searchParams.get("tabs"); // comma-separated

    if (!spreadsheetId || !tabs) {
      return NextResponse.json(
        { error: "Missing spreadsheetId or tabs" },
        { status: 400 }
      );
    }

    const token = await getAccessToken();
    const tabList = tabs.split(",").map((t) => t.trim());

    const results: Record<string, string[][]> = {};

    for (const tab of tabList) {
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(tab)}`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const err = await res.text();
        return NextResponse.json(
          { error: `Error reading tab "${tab}": ${err}` },
          { status: res.status }
        );
      }

      const data = await res.json();
      results[tab] = data.values || [];
    }

    return NextResponse.json({ data: results });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST: Write data back to spreadsheet tabs
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { spreadsheetId, updates } = body as {
      spreadsheetId: string;
      updates: Record<string, string[][]>;
    };

    if (!spreadsheetId || !updates) {
      return NextResponse.json(
        { error: "Missing spreadsheetId or updates" },
        { status: 400 }
      );
    }

    const token = await getAccessToken();

    // Clear and write each tab
    for (const [tab, rows] of Object.entries(updates)) {
      // Clear
      await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(tab)}:clear`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Write
      if (rows.length > 0) {
        await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(tab)}?valueInputOption=RAW`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              range: tab,
              majorDimension: "ROWS",
              values: rows,
            }),
          }
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
