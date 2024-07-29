'use server';
import jwt from 'jsonwebtoken';

import { SessionSignKey } from '@/constants';

interface Token {
  id: string;
}

export async function verify(token: string): Promise<undefined | Token> {
  return await new Promise<undefined | Token>((rs) =>
    jwt.verify(token, SessionSignKey, (e, d) => {
      if (e) {
        rs(undefined);
        return;
      }
      rs(d as Token);
    }),
  );
}
