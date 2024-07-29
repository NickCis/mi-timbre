import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import DB from '@/db';
import { SessionSignKey } from '@/constants';

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  if (!params.id) return new NextResponse('Not Found', { status: 404 });
  const building = DB[params.id];

  if (!building) return new NextResponse('Not Found', { status: 404 });

  const token = await new Promise((rs, rj) =>
    jwt.sign(
      { id: params.id },
      SessionSignKey,
      {
        expiresIn: '10m',
      },
      (e, t) => {
        if (e) {
          rj(e);
          return;
        }
        rs(t);
      },
    ),
  );

  return NextResponse.redirect(new URL(`/s/${token}`, request.url));
}
