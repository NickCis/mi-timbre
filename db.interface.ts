export interface Door {
  id: string;
  name: string;
  topic: string;
}

export interface Building {
  id: string;
  doors: Door[];
}

export type DB = Record<string, Building>;
