import { Collection, ObjectId } from 'mongodb';

interface User {
  email: string;
  _id: ObjectId;
}

const User = (collection: Collection<User>) => ({
  readOne: async (email) => {
    return collection?.findOne({ email });
  },
});

export default User;
