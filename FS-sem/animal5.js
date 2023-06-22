const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
app.use(express.json());

class ZooAnimal {
  constructor(name, birthYear) {
    this.name = name;
    this.birthYear = birthYear;
  }
}

class ZooDatabase {
  constructor(connectionString, dbName) {
    this.connectionString = connectionString;
    this.dbName = dbName;
  }

  async connect() {
    this.client = new MongoClient(this.connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
    await this.client.connect();
    this.db = this.client.db(this.dbName);
    console.log('Connected to MongoDB');
  }

  async disconnect() {
    await this.client.close();
    console.log('Disconnected from MongoDB');
  }

  async createAnimal(animal) {
    const result = await this.db.collection('animals').insertOne(animal);
    console.log(`Created animal with ID: ${result.insertedId}`);
    return result.insertedId;
  }

  async readAnimals() {
    const animals = await this.db.collection('animals').find({}).toArray();
    console.log('All animals:');
    animals.forEach(animal => console.log(animal));
    return animals;
  }

  async updateAnimal(id, updates) {
    const result = await this.db.collection('animals').updateOne({ _id: id }, { $set: updates });
    console.log(`Updated ${result.modifiedCount} animal(s)`);
    return result.modifiedCount;
  }

  async deleteAnimal(id) {
    const result = await this.db.collection('animals').deleteOne({ _id: id });
    console.log(`Deleted ${result.deletedCount} animal(s)`);
    return result.deletedCount;
  }

  async countAnimalsAliveAfterYears(n) {
    const currentYear = new Date().getFullYear();
    const aliveAnimals = await this.db.collection('animals').countDocuments({ birthYear: { $lte: currentYear - n } });
    console.log(`Number of animals alive after ${n} years: ${aliveAnimals}`);
    return aliveAnimals;
  }
}

// Set up your MongoDB connection string and database name
const connectionString = 'mongodb+srv://binuppbbsc22:binu1506@cluster0.kadncde.mongodb.net/?retryWrites=true&w=majority';
const dbName = 'zoo';

app.post('/animals', async (req, res) => {
  const { name, birthYear } = req.body;

  const animal = new ZooAnimal(name, birthYear);
  const zooDB = new ZooDatabase(connectionString, dbName);
  await zooDB.connect();

  const insertedId = await zooDB.createAnimal(animal);

  await zooDB.disconnect();

  res.json({ insertedId });
});

app.get('/animals', async (req, res) => {
  const zooDB = new ZooDatabase(connectionString, dbName);
  await zooDB.connect();

  const animals = await zooDB.readAnimals();

  await zooDB.disconnect();

  res.json(animals);
});

app.put('/animals/:id', async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const zooDB = new ZooDatabase(connectionString, dbName);
  await zooDB.connect();

  const modifiedCount = await zooDB.updateAnimal(id, { name });

  await zooDB.disconnect();

  res.json({ modifiedCount });
});

app.delete('/animals/:id', async (req, res) => {
  const { id } = req.params;

  const zooDB = new ZooDatabase(connectionString, dbName);
  await zooDB.connect();

  const deletedCount = await zooDB.deleteAnimal(id);

  await zooDB.disconnect();

  res.json({ deletedCount });
});

app.get('/animals/count/:years', async (req, res) => {
    const { years } = req.params;
  
    const zooDB = new ZooDatabase(connectionString, dbName);
    await zooDB.connect();
  
    const aliveAnimalsCount = await zooDB.countAnimalsAliveAfterYears(parseInt(years));
  
    await zooDB.disconnect();
  
    res.json({ aliveAnimalsCount });
  });
  
  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
