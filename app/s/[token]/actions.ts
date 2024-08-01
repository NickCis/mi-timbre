'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import DB from '@/db';
import { UserCookieName } from '@/constants';

import { verify } from './utils';

export async function sendNotification(
  token: string,
  buildingId: string,
  prev: any,
  formData: FormData,
) {
  const doorId = formData.get('door') as string;
  const uid = cookies().get(UserCookieName)?.value;

  if (!token || !buildingId || !doorId || !uid)
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

  const res = await fetch('https://ntfy.sh/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      topic: door.topic,
      title: `Tocaron timbre en ${door.name}`,
      message: 'Alguien esta en la puerta!',
      tags: ['door'],
      priority: 5,
      actions: [
        {
          action: 'http',
          label: 'Yendo!',
          url: `https://ntfy.sh/`,
          body: JSON.stringify({
            topic: `mtui-${uid}`,
            title: 'message',
            message: JSON.stringify({
              text: 'Hola, estoy yendo!',
              doorId: door.id,
            }),
          }),
        },
      ],
    }),
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
