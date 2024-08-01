import { v4 as uuid } from 'uuid';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { UserCookieName } from '@/constants';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  if (!request.cookies.has(UserCookieName))
    response.cookies.set({
      name: UserCookieName,
      value: uuid(),
      path: '/',
      secure: true,
      maxAge: 31619000,
    });
  return response;
}
