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
