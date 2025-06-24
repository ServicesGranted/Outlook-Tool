import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  // Health check route
  return NextResponse.json({ alive: true });
}

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();
    const token = request.headers.get('authorization') || '';
    const n8nBase = process.env.N8N_BASE_URL;
    if (!n8nBase) {
      throw new Error('Missing N8N_BASE_URL environment variable');
    }
    const webhookUrl = `${n8nBase}/webhook/d97330c8-2c03-47f1-b67e-dbc034c8c60e`;

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify({ query }),
    });

    const text = await response.text();
    return new NextResponse(text, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  } catch (error: any) {
    console.error('API n8n proxy error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
