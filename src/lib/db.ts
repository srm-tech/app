import { MongoClient, ObjectId } from 'mongodb';
import { env } from '@/lib/envConfig';

const uri = `${env.DB_URI}/${env.DB_NAME}?keepAlive=true&socketTimeoutMS=10000&connectTimeoutMS=10000&retryWrites=true&w=majority`;

export const getDb = () => {
  const client = new MongoClient(uri, {
    maxPoolSize: 20,
    wtimeoutMS: 10000,
  });
  const db = client.db(env.DB_NAME);
  return { client, db, dbName: env.DB_NAME };
};
export const getCollection = (dbOptions) => (collectionName: string) => {
  const { client, db } = dbOptions;
  return db.collection(collectionName);
};

export { ObjectId };
