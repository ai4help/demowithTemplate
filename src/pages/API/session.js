export const dynamic = 'force-dynamic' // defaults to auto
import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
    try {
        const client = new MongoClient('mongodb+srv://ai4help:U0p2JkljIeOO0VJs@cluster0.t086sbe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {});
        await client.connect();
        const database = client.db('ai4help'); // Choose a name for your database

        const collection = database.collection('conv'); // Choose a name for your collection
        const userData = await collection.findOne({ name: req.body.data.email });
        if (userData) {
            if (userData.password !== req.body.data.password) {
                res.status(401).send({ message: 'Invalid password' });
            } else if (userData.name === req.body.data.email) {
                res.status(200).send({ message: 'Login successful' });
            }
        } else {
            res.status(404).send({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).send({ message: 'Something went wrong!' });
    }
}
