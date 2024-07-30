'use server';

import { BellRing } from 'lucide-react';

import DB from '@/db';
import { Separator } from '@/components/ui/separator';

import { verify } from './utils';
import { Door } from './door';

export interface BuildingProps {
  params: { token: string };
}

export default async function Building({ params }: BuildingProps) {
  const token = params.token;

  if (!token) return <>Invalid</>;
  const decoded = await verify(token);

  if (!decoded) return <>Invalid</>;
  const building = DB[decoded.id];

  if (!building) return <>Invalid</>;

  return (
    <div>
      <div className="group flex items-center text-sm font-medium p-3">
        <BellRing className="w-4 h-4" />
        <Separator orientation="verticall" className="mx-2 h-4" />
        <span className="underline-offset-4 group-hover:underline">
          Mi Timbre
        </span>
      </div>
      <div className="mx-2">
        <h2 className="block m-4 text-3xl font-bold leading-tight tracking-tighter">
          ¿Con qué departamento te querés contactar?
        </h2>
        <div className="flex flex-wrap">
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
        </div>
      </div>
    </div>
  );
}
