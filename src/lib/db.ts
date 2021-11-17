import { MongoClient, ObjectId } from 'mongodb';
import { env } from '@/lib/envConfig';

const uri = `${env.DB_URI}/${env.DB_NAME}?keepAlive=true&socketTimeoutMS=10000&connectTimeoutMS=10000&retryWrites=true&w=majority`;

export const getDb = (collectionName: string) => {
  const client = new MongoClient(uri, {
    maxPoolSize: 20,
    wtimeoutMS: 10000,
  });
  const collection = client.db(env.DB_NAME).collection(collectionName);
  return { client, collection };
};

export { ObjectId };
