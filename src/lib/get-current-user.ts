import { ObjectId } from 'mongodb';

export default async function getCurrentUser() {
  return {
    _id: ObjectId('000000000000000000000001'),
  };
}
