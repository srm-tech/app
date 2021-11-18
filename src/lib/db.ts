import { MongoClient, ObjectId } from 'mongodb';
import { env } from '@/lib/envConfig';

const uri = `${env.DB_URI}/${env.DB_NAME}?keepAlive=true&socketTimeoutMS=10000&connectTimeoutMS=10000&retryWrites=true&w=majority`;

export const getDb = (collectionName?: string) => {
  const client = new MongoClient(uri, {
    maxPoolSize: 20,
    wtimeoutMS: 10000,
  });
  const db = client.db(env.DB_NAME);
  const collection = (collectionName && db.collection(collectionName)) || null;
  return { client, db, collection };
};

export { ObjectId };
