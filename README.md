# Mi Timbre

Para correr en desarrollo:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## Escuchar las notificaciones

Las notificaciones se envían a través de [ntfy.sh](https://ntfy.sh/). Se puede usar la app o la [versión web](https://ntfy.sh/app).

Para recibir las notificaciones, uno se debe suscribir al tema de la notificación de la puerta que quiere escuchar.

## Configuración

La implementación actual no utiliza una base de datos, si no, un archivo para guardar los ids de edificios, puertas y los nombres de los temas que se usan para enviar las notifications.

Para configurar, copiar el archivo `db.example.ts` a `db.ts` y editar:

```typescript
import type { DB } from './db.interface';

const data: DB = {
  '{building-id}': {
    id: '{building-id}',
    doors: [
      {
        id: '{door-id}',
        name: 'door name',
        topic: 'door-{door-id}',
      },
    ],
  },
};

export default data;
```

Lo ideal sería que los ids sean uuid v4, se puede usar cualquier generador de [ids online](https://uuidonline.com/)

## Generar QR

Para obtener un QR para el tablero de timbres de un edificio se debe entrar al link `/qr/<building-id>`.
