import { MongoClient } from 'mongodb';
import nextConnect from 'next-connect';

const client = new MongoClient('mongodb://localhost:27017/', {
  // todo: do not hardcode!
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function database(req, res, next) {
  await client.connect();
  req.dbClient = client;
  req.db = client.db('guru'); // todo: do not hardcode!
  return next();
}

const middleware = nextConnect();

middleware.use(database);

export default middleware;
