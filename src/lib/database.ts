// import { connect, ConnectionOptions } from "mongoose"

import { MongoClient } from 'mongodb';

// console.log(":", process.env.MONGODB_URI)

// const options: ConnectionOptions = {
//     useUnifiedTopology: true,
//     useNewUrlParser: true
// }

// export const connectToDatabase = () => connect(process.env.MONGODB_URI, options)

export async function getConnection() {
  const client = await MongoClient.connect(process.env.MONDGODB_URI || '');
  const db = client.db();
}
