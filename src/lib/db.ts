import { MongoClient, ObjectId, Db, Collection } from 'mongodb';
import { env } from '@/lib/envConfig';

export const getDb = () => {
  const client = new MongoClient(uri, {
    maxPoolSize: 20,
    wtimeoutMS: 10000,
  });
  const db = client.db(env.DB_NAME);
  return { client, db, dbName: env.DB_NAME };
};

// interface DBOptions {
//   client: MongoClient;
//   db: Db;
//   dbName: string;
// }

// export const getCollection =
//   () =>
//   (collectionName: string): { db: Db; collection: Collection<Document> } => {
//     const { db } = getDb();
//     return { db, collection: db.collection(collectionName) };
//   };

export { ObjectId };

let cachedClient;
let cachedDb;
const uri = `${env.DB_URI}/${env.DB_NAME}?keepAlive=true&socketTimeoutMS=10000&connectTimeoutMS=10000&retryWrites=true&w=majority`;

if (!uri) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

if (!env.DB_NAME) {
  throw new Error(
    'Please define the MONGODB_DB environment variable inside .env.local'
  );
}

export const connectToDatabase = async (): Promise<{
  client: MongoClient;
  db: Db;
}> => {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = await MongoClient.connect(uri);
  const db = client.db(env.DB_NAME);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
};
