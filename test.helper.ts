// Define an helper function to clear the tables.

import { DataSource } from 'typeorm';

export async function clearDB() {
  const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'test',
    password: 'test',
    database: 'test',
    entities: [
      // ....
    ],
  });
}
