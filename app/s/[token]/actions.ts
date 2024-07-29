'use server';

import { redirect } from 'next/navigation';

import DB from '@/db';

import { verify } from './utils';

export async function sendNotification(
  token: string,
  buildingId: string,
  prev: any,
  formData: FormData,
) {
  const doorId = formData.get('door') as string;

  if (!token || !buildingId || !doorId)
    return {
      error: 'missing-arguments',
      errorMessage: 'Hubo un error',
    };

  const decoded = await verify(token);
  if (!decoded) return redirect(`/s/${token}`);

  const building = DB[buildingId];

  if (!building) {
    return {
      error: 'no-building',
      errorMessage: 'Hubo un error',
    };
  }

  let door;
  for (const d of building.doors) {
    if (d.id === doorId) {
      door = d;
      break;
    }
  }

  if (!door) {
    return {
      error: 'no-door',
      errorMessage: 'Hubo un error',
    };
  }

  const url = `https://ntfy.sh/${door.topic}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Priority: 'urgent',
      Tags: 'door',
      Title: `Tocaron timbre en ${door.name}`,
    },
    body: 'Alguien esta en la puerta!',
  });

  if (!res.ok) {
    return {
      error: 'failed-notify',
      errorMessage: 'Hubo un error',
    };
  }

  const json = await res.json();

  return { success: true, id: json.id };
}
