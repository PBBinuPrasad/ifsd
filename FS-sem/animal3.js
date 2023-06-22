const prompt=require("prompt-sync")();

const { MongoClient } = require('mongodb');

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
  }

  async readAnimals() {
    const animals = await this.db.collection('animals').find({}).toArray();
    console.log('All animals:');
    animals.forEach(animal => console.log(animal));
  }

  async updateAnimal(id, updates) {
    const result = await this.db.collection('animals').updateOne({ _id: id }, { $set: updates });
    console.log(`Updated ${result.modifiedCount} animal(s)`);
  }

  async deleteAnimal(id) {
    const result = await this.db.collection('animals').deleteOne({ _id: id });
    console.log(`Deleted ${result.deletedCount} animal(s)`);
  }

  async countAnimalsAliveAfterYears(n) {
    const currentYear = new Date().getFullYear();
    const aliveAnimals = await this.db.collection('animals').countDocuments({ birthYear: { $lte: currentYear - n } });
    console.log(`Number of animals alive after ${n} years: ${aliveAnimals}`);
  }
}

async function main() {
  const connectionString = 'mongodb+srv://binuppbbsc22:binu1506@cluster0.kadncde.mongodb.net/zoo';
  const dbName = 'zoo';

  const zooDB = new ZooDatabase(connectionString, dbName);
  await zooDB.connect();

  const lion = new ZooAnimal('Lion', 2015);
  const elephant = new ZooAnimal('Elephant', 2010);
  const giraffe = new ZooAnimal('Giraffe', 2018);

  await zooDB.createAnimal(lion);
  await zooDB.createAnimal(elephant);
  await zooDB.createAnimal(giraffe);

  await zooDB.readAnimals();

  const animalIdToUpdate = lion._id; // Replace with the actual ID of the animal to update
  await zooDB.updateAnimal(animalIdToUpdate, { name: 'Tiger' });

  const animalIdToDelete = elephant._id; // Replace with the actual ID of the animal to delete
  await zooDB.deleteAnimal(animalIdToDelete);

  const years = 5; // Specify the number of years
  await zooDB.countAnimalsAliveAfterYears(years);

  await zooDB.disconnect();
}

main().catch(err => console.error('Error:', err));