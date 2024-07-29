import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import QRCode from 'qrcode';

import DB from '@/db';

async function getQRCode(
  data: string,
  { width = 180, margin = 4 }: { width?: number; margin?: number },
): Promise<Buffer> {
  return await new Promise((rs, rj) => {
    QRCode.toDataURL(
      data,
      {
        type: 'image/png',
        width,
        margin,
      },
      (err, url) => {
        if (err) {
          rj(err);
          return;
        }
        try {
          rs(Buffer.from(url.split(',')[1], 'base64'));
        } catch (error) {
          rj(error);
        }
      },
    );
  });
}

function getURL() {
  const h = headers();

  if (h.get('x-forwarded-host')) {
    return `${h.get('x-forwarded-proto') || 'https'}://${h.get('x-forwarded-host')}`;
  }

  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }

  return 'http://localhost:3000';
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  if (!params.id) return new NextResponse('Not Found', { status: 404 });
  const building = DB[params.id];

  if (!building) return new NextResponse('Not Found', { status: 404 });
  const requestUrl = new URL(request.url);
  const width =
    parseInt(requestUrl.searchParams.get('width') || '0', 10) || 180;
  const margin =
    parseInt(requestUrl.searchParams.get('margin') || '0', 10) || 4;

  const url = getURL();
  const code = await getQRCode(`${url}/building/${building.id}`, {
    width,
    margin,
  });

  return new NextResponse(code, {
    status: 200,
    headers: { 'Content-Type': 'image/png' },
  });
}
