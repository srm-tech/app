import { MongoClient } from 'mongodb';
import { env } from './envConfig';

const openDbConnection = (url) => {
  const p = new Promise((resolve, reject) => {
    MongoClient.connect(url, {}, async (error, client) => {
      if (error) {
        reject(error);
        return;
      }

      const dbName = env.DB_NAME || 'test';
      const db = client?.db(dbName);

      resolve({ client, db });
    });
  });
  p.catch((err) => console.log('ERROR: openDbConnection', err));
  return p;
};

const createDbConnection = async () => {
  const url = `mongodb://mongo:27017`;

  try {
    return await openDbConnection(url);
  } catch (err) {
    throw `ERROR: createDbConnection - ${err}`;
  }
};

export default createDbConnection;
