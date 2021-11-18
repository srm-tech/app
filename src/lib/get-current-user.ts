import { ObjectId } from 'bson';

export default function getCurrentUser() {
  return {
    _id: ObjectId('000000000000000000000001'),
  };
}
