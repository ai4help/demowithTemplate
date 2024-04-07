import { MongoClient } from 'mongodb';

export default async function connectMongo(email, password) {
  console.log(email, password);
  if (req.method === 'POST') {
    const { data } = req.body;
    console.log(data);
    const client = new MongoClient(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    try {
      await client.connect();
      const database = client.db('ai4help'); // Choose a name for your database

      const collection = database.collection('userData'); // Choose a name for your collection

      const userData = await collection.findOne({ name: data });

      res.status(200).json({ userData });
    } catch (error) {
      res.status(500).json({ message: 'Something went wrong!' });
    } finally {
      await client.close();
    }
  } else {
    res.status(405).json({ message: 'this should be a POST' });
  }
}
