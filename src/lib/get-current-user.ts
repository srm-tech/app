import { ObjectId } from 'bson';

export default async function getCurrentUser() {
  return {
    _id: new ObjectId('000000000000000000000001'),
  };
}
