'use server';

import DB from '@/db';

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
  );
}
