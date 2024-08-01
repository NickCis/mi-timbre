'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import DB from '@/db';
import { UserCookieName } from '@/constants';
import { Wrapper } from '@/components/wrapper';

import { verify } from './utils';
import { Door } from './door';
import { MessagesProvider } from './messages';

export interface BuildingProps {
  params: { token: string };
}

export default async function Building({ params }: BuildingProps) {
  const token = params.token;
  if (!token) return redirect('/expired');

  const decoded = await verify(token);
  if (!decoded) return redirect('/expired');

  const building = DB[decoded.id];
  if (!building) return redirect('/expired');

  const uid = cookies().get(UserCookieName)?.value;

  return (
    <Wrapper>
      <h2 className="block m-4 text-3xl font-bold leading-tight tracking-tighter">
        ¿Con qué departamento te querés contactar?
      </h2>
      <div className="flex flex-wrap">
        <MessagesProvider uid={uid}>
          {building.doors.map((door) => (
            <div key={door.id} className="m-1 w-full md:w-1/4 lg:w-1/5">
              <Door
                id={door.id}
                name={door.name}
                token={token}
                buildingId={building.id}
              />
            </div>
          ))}
        </MessagesProvider>
      </div>
    </Wrapper>
  );
}
